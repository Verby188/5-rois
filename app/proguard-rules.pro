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
