package com.verby188.cinqrois

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.Log
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
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.firebase.messaging.FirebaseMessaging
import com.google.android.play.core.review.ReviewManagerFactory

/** Interface exposée au JS pour déclencher le redémarrage après mise à jour. */
class AndroidBridge(private val activity: MainActivity) {
    @android.webkit.JavascriptInterface
    fun completeUpdate() {
        activity.runOnUiThread {
            activity.appUpdateManager.completeUpdate()
        }
    }

    @android.webkit.JavascriptInterface
    fun requestReview() {
        activity.runOnUiThread {
            activity.showInAppReview()
        }
    }

    @android.webkit.JavascriptInterface
    fun showInterstitial() {
        activity.runOnUiThread {
            activity.showInterstitialAd()
        }
    }
}

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var adView: AdView
    private var interstitialAd: InterstitialAd? = null
    // ID de l'unite "Interstitiel fin de partie" (console AdMob).
    // ID de TEST Google si besoin de revalider le cablage : ca-app-pub-3940256099942544/1033173712
    private val interstitialAdUnitId = "ca-app-pub-6145497382360748/1750052165"
    private var pendingCode: String? = null
    private var pendingNotifData: String? = null

    // ── In-App Updates ──
    val appUpdateManager by lazy { AppUpdateManagerFactory.create(this) }
    private val UPDATE_REQUEST_CODE = 1234

    private val installStateListener = InstallStateUpdatedListener { state ->
        if (state.installStatus() == InstallStatus.DOWNLOADED) {
            // Mise à jour téléchargée : notifier le JS pour afficher une bannière
            webView.post {
                webView.evaluateJavascript(
                    "if(typeof onUpdateReady==='function')onUpdateReady();", null
                )
            }
        }
    }

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
        loadInterstitial()   // precharger le premier interstitiel de fin de partie

        // ── Extraire le code d'invitation AVANT de charger la WebView (pattern U9) ──
        val notifType = intent?.getStringExtra("type")
        if (notifType == "gameInvite") {
            val code = intent?.getStringExtra("code") ?: ""
            if (code.isNotEmpty()) pendingCode = code
        }

        // Demander la permission notifications (Android 13+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(
                    arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 1001
                )
            }
        }

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        webView = WebView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f
            )
        }

        adView = AdView(this).apply {
            adUnitId = "ca-app-pub-6145497382360748/7978022975"
            // Bannière adaptive — s'ajuste à la largeur de l'écran
            val metrics = DisplayMetrics()
            @Suppress("DEPRECATION")
            windowManager.defaultDisplay.getMetrics(metrics)
            val adWidth = (metrics.widthPixels / metrics.density).toInt()
            setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this@MainActivity, adWidth))
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

        webView.addJavascriptInterface(AndroidBridge(this), "Android")

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
                // Injecter le FCM token
                getFcmTokenAndInject()
                // Injecter le code deep link si en attente
                pendingCode?.let { code ->
                    injectCode(code)
                    pendingCode = null
                }
                // Injecter les données de notification si en attente
                pendingNotifData?.let { data ->
                    injectNotification(data)
                    pendingNotifData = null
                }
            }
        }

        // Charger la page — code passé via hash si cold start depuis notification
        val startUrl = if (pendingCode != null) {
            val code = pendingCode!!
            pendingCode = null
            "file:///android_asset/index.html#invite=$code"
        } else {
            "file:///android_asset/index.html"
        }
        webView.loadUrl(startUrl)
        adView.loadAd(AdRequest.Builder().build())

        handleIntent(intent)
        checkForUpdate()
    }

    // ── In-App Updates ──
    private fun checkForUpdate() {
        appUpdateManager.registerListener(installStateListener)
        appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
            if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && info.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)
            ) {
                appUpdateManager.startUpdateFlowForResult(
                    info,
                    this,
                    AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build(),
                    UPDATE_REQUEST_CODE
                )
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == UPDATE_REQUEST_CODE && resultCode != Activity.RESULT_OK) {
            // L'utilisateur a refusé ou annulé — on réessaiera au prochain lancement
        }
    }

    private fun getFcmTokenAndInject() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val token = task.result
                webView.post {
                    webView.evaluateJavascript("if(typeof onFcmToken==='function')onFcmToken('$token');", null)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        if (intent == null) return

        val notifType = intent.getStringExtra("type")
        if (notifType != null) {
            val code = intent.getStringExtra("code") ?: ""
            val from = intent.getStringExtra("senderName") ?: intent.getStringExtra("from") ?: ""

            if (notifType == "gameInvite" && code.isNotEmpty()) {
                // App en avant-plan (warm start) → injecter directement
                // App fermée (cold start) → pendingCode déjà consommé dans loadUrl
                if (::webView.isInitialized && webView.url != null) {
                    injectCode(code)
                }
                return
            }

            // Autres types de notifications (friendRequest, etc.)
            val data = """{"type":"$notifType","code":"$code","from":"$from"}"""
            if (::webView.isInitialized && webView.url != null) {
                injectNotification(data)
            } else {
                pendingNotifData = data
            }
            return
        }

        // Deep link cinqcouronnes://join/CODE
        val uri = intent.data ?: return
        val code = extractCode(uri) ?: return
        if (::webView.isInitialized && webView.url != null) {
            injectCode(code)
        } else {
            pendingCode = code
        }
    }

    private fun extractCode(uri: Uri): String? {
        if (uri.scheme == "cinqcouronnes" && uri.host == "join") {
            val path = uri.pathSegments.firstOrNull()
            if (path?.length == 6) return path.uppercase()
        }
        if (uri.scheme == "https") {
            val code = uri.getQueryParameter("code")
            if (code?.length == 6) return code.uppercase()
        }
        return null
    }

    private fun injectCode(code: String) {
        webView.post {
            webView.evaluateJavascript(
                "if(typeof onDeepLinkCode==='function')onDeepLinkCode('$code');",
                null
            )
        }
    }

    private fun injectNotification(data: String) {
        webView.post {
            webView.evaluateJavascript(
                "if(typeof onFcmMessage==='function')onFcmMessage('${data.replace("'", "\\'")}');",
                null
            )
        }
    }

    // Appelé par le service FCM quand notification reçue en foreground
    fun showInAppReview() {
        val reviewManager = ReviewManagerFactory.create(this)
        reviewManager.requestReviewFlow().addOnCompleteListener { request ->
            if (request.isSuccessful) {
                reviewManager.launchReviewFlow(this, request.result)
            }
        }
    }

    // ── Interstitiel de fin de partie ──
    fun loadInterstitial() {
        Log.d("INTER", "loadInterstitial() appelé")
        InterstitialAd.load(
            this,
            interstitialAdUnitId,
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    Log.d("INTER", "chargé OK")
                    ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                        override fun onAdDismissedFullScreenContent() {
                            // Pub fermée : on précharge la suivante pour la prochaine partie.
                            interstitialAd = null
                            loadInterstitial()
                        }
                        override fun onAdFailedToShowFullScreenContent(e: AdError) {
                            Log.e("INTER", "échec affichage : ${e.code} ${e.message}")
                            interstitialAd = null
                            loadInterstitial()
                        }
                    }
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    // Pas de remplissage / erreur : on retentera au prochain appel.
                    interstitialAd = null
                    Log.e("INTER", "échec chargement : ${error.code} ${error.message}")
                }
            }
        )
    }

    /** Appelé depuis le JS (saveGameHistory) à la fin d'une partie. */
    fun showInterstitialAd() {
        Log.d("INTER", "showInterstitialAd() appelé — pub prête ? ${interstitialAd != null}")
        val ad = interstitialAd
        if (ad != null) {
            ad.show(this)
        } else {
            // Pas encore prêt : on relance un chargement pour la prochaine fin de partie.
            loadInterstitial()
        }
    }

    fun onMessageReceived(data: Map<String, String>) {
        val json = data.entries.joinToString(",") { "\"${it.key}\":\"${it.value}\"" }
        injectNotification("{$json}")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        adView.resume()
        // Si une mise à jour flexible a été téléchargée pendant que l'app était en arrière-plan
        appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
            if (info.installStatus() == InstallStatus.DOWNLOADED) {
                webView.post {
                    webView.evaluateJavascript(
                        "if(typeof onUpdateReady==='function')onUpdateReady();", null
                    )
                }
            }
        }
    }
    override fun onPause() { super.onPause(); webView.onPause(); adView.pause() }
    override fun onDestroy() {
        super.onDestroy()
        appUpdateManager.unregisterListener(installStateListener)
        adView.destroy()
    }
}
