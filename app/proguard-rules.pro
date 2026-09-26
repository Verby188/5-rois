-keep class com.u9game.** { *; }
# WorkManager (utilisé implicitement par AdMob) — ne pas obfusquer
-keep class androidx.work.** { *; }
-keep class * extends androidx.work.Worker { *; }
-keep class * extends androidx.work.ListenableWorker { *; }
-keep class androidx.work.impl.** { *; }
-dontwarn androidx.work.**

# Room (base de données de WorkManager)
-keep class androidx.room.** { *; }
-keep class * extends androidx.room.RoomDatabase { *; }
-dontwarn androidx.room.**

# AndroidX Startup (initialisation au démarrage)
-keep class androidx.startup.** { *; }

# Meta Audience Network (médiation publicitaire) — le SDK référence des
# annotations internes (Nullsafe) absentes au runtime : on garde le SDK entier
# et on ignore ces annotations, comme recommandé pour tout SDK pub tiers avec R8.
-keep class com.facebook.ads.** { *; }
-dontwarn com.facebook.ads.**
-dontwarn com.facebook.infer.annotation.**
