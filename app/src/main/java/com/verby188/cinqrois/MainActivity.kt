package com.verby188.cinqrois

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.*
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.MobileAds

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var adView: AdView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        )

        MobileAds.initialize(this)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        webView = WebView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }

        adView = AdView(this).apply {
            adUnitId = "ca-app-pub-6145497382360748/7978022975"
            setAdSize(AdSize.BANNER)
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        layout.addView(webView)
        layout.addView(adView)
        setContentView(layout)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(false)
            displayZoomControls = false
            builtInZoomControls = false
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                request.grant(request.resources)
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url.toString()
                return when {
                    url.startsWith("sms:") || url.startsWith("smsto:") -> {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    }
                    url.startsWith("tel:") -> {
                        startActivity(Intent(Intent.ACTION_DIAL, Uri.parse(url)))
                        true
                    }
                    url.startsWith("mailto:") -> {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    }
                    else -> false
                }
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                // Injecter le code si deep link reçu au démarrage
                pendingCode?.let { code ->
                    injectCode(code)
                    pendingCode = null
                }
            }
        }

        webView.loadUrl("file:///android_asset/index.html")

        val adRequest = AdRequest.Builder().build()
        adView.loadAd(adRequest)

        // Traiter le deep link de démarrage
        handleIntent(intent)
    }

    private var pendingCode: String? = null

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        if (intent == null) return
        val uri = intent.data ?: return
        val code = extractCode(uri) ?: return

        // Si la WebView est prête, injecter directement
        if (webView.url != null) {
            injectCode(code)
        } else {
            // Sinon attendre que la page soit chargée (onPageFinished)
            pendingCode = code
        }
    }

    private fun extractCode(uri: Uri): String? {
        // cinqcouronnes://join/XXXXXX
        if (uri.scheme == "cinqcouronnes" && uri.host == "join") {
            val path = uri.pathSegments.firstOrNull()
            if (path?.length == 6) return path.uppercase()
        }
        // https://verby188.github.io/5-rois/join.html?code=XXXXXX
        if (uri.scheme == "https") {
            val code = uri.getQueryParameter("code")
            if (code?.length == 6) return code.uppercase()
        }
        return null
    }

    private fun injectCode(code: String) {
        webView.post {
            webView.evaluateJavascript("""
                (function() {
                    try {
                        // Aller sur l'écran multijoueur
                        if(typeof show === 'function') show('s-net');
                        // Remplir le code
                        var inp = document.getElementById('join-code');
                        if(inp) {
                            inp.value = '$code';
                            if(typeof checkCodeInput === 'function') checkCodeInput();
                        }
                        // Afficher la bannière d'invitation
                        var box = document.getElementById('code-detected-box');
                        if(box) {
                            box.style.display = 'flex';
                            box.className = 'code-detected';
                            box.innerHTML = '<span>🎴</span><span>Invitation reçue — Code : <b>$code</b></span>';
                            box.onclick = null;
                        }
                    } catch(e) { console.error('DeepLink error:', e); }
                })();
            """.trimIndent(), null)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    override fun onResume() { super.onResume(); webView.onResume(); adView.resume() }
    override fun onPause() { super.onPause(); webView.onPause(); adView.pause() }
    override fun onDestroy() { super.onDestroy(); adView.destroy() }
}
