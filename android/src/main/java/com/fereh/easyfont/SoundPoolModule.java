package com.fereh.easyfont;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.ArrayList;
import android.util.SparseArray;
import android.media.SoundPool;

public class SoundPoolModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;
    private SoundPool realPool;
    private ArrayList<Integer> soundsInPool = new ArrayList<>();
    private HashMap<String, Integer> soundMap = new HashMap<>();
    private SparseArray<Promise> loadPromises = new SparseArray<>();

    public SoundPoolModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        realPool = null; // waiting for create()
    }

    @Override
    public String getName() {
        return "SoundPool";
    }

    @ReactMethod
    public void create(int maxStreams) {
        // Only one pool can exist at a time for now
        if (realPool != null) {
            release();
        }

        realPool = new SoundPool.Builder()
            .setMaxStreams(maxStreams)
            .build();

        realPool.setOnLoadCompleteListener(new SoundPool.OnLoadCompleteListener() {
            @Override
            public void onLoadComplete(SoundPool unused, int soundId, int status) {
                if (status != 0) {
                    loadPromises.get(soundId).reject("load", "Failed to load with status " + status);
                    return;
                }
                soundsInPool.add(soundId);
                loadPromises.get(soundId).resolve(soundId);
            }
        });
    }

    @ReactMethod
    public void release() {
        soundMap.clear();
        soundsInPool.clear();
        loadPromises.clear();
        realPool.release();
        realPool = null;
    }

    @ReactMethod
    public void load(String name, Promise promise) {
        if (soundMap.containsKey(name)) {
            if (soundsInPool.contains(soundMap.get(name))) {
                promise.resolve(soundsInPool.get(soundMap.get(name)));
            }
            else {
                promise.reject("load", "Sound loading");
            }
            return;
        }

        int resourceId = context.getResources().getIdentifier(
            name, "raw", context.getPackageName());
        if (resourceId == 0) {
            promise.reject("load", "Resource not found");
            return;
        }
        int soundId = realPool.load(context, resourceId, 1);
        loadPromises.put(soundId, promise);
        soundMap.put(name, soundId);
    }

    @ReactMethod
    public void unload(int soundId) {
        if (soundsInPool.contains(soundId)) {
            realPool.unload(soundId);
            soundsInPool.remove(soundId);
        }
    }

    @ReactMethod
    public void play(int soundId, int loops, float rate, float gain, Promise promise) {
        if (!soundsInPool.contains(soundId)) {
            promise.reject("play", "Sound not loaded " + soundId);
            return;
        }

        int streamId = realPool.play(soundId, gain, gain, 1, loops, rate);
        if (streamId == 0) {
            promise.reject("play", "Internal error");
            return;
        }
        promise.resolve(streamId);
    }

    @ReactMethod
    public void playSync(ReadableArray soundIds, int loops, float rate, float gain, Promise promise) {
        for (int i = 0; i < soundIds.size(); i++) {
            if (!soundsInPool.contains(soundIds.getInt(i))) {
                promise.reject("playSync", "Sound not loaded " + soundIds.getInt(i));
                return;
            }
        }
        WritableArray streamIds = Arguments.createArray();
        // TODO: better, garenteed syncing technique?
        for (int i = 0, streamId; i < soundIds.size(); i++) {

            streamId = realPool.play(soundIds.getInt(i), gain, gain, 1, loops, rate);
            if (streamId == 0) {
                promise.reject("playSync", "Internal error");
                return;
            }
            streamIds.pushInt(streamId);

        }
        promise.resolve(streamIds);
    }

    @ReactMethod
    public void stop(int streamId) {
        realPool.stop(streamId);
    }
    @ReactMethod
    public void pause(int streamId) {
        realPool.pause(streamId);
    }
    @ReactMethod
    public void resume(int streamId) {
        realPool.resume(streamId);
    }
    @ReactMethod
    public void autoPause() {
        realPool.autoPause();
    }
    @ReactMethod
    public void autoResume() {
        realPool.autoResume();
    }

    /*private static String getKeyFromValue(Map hm, int value) {
        for (Object o : hm.keySet()) {
            if (hm.get(o).equals(value)) {
                return o.toString();
            }
        }
        return null;
    }*/
}
