<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <p id="display" class="mirrorY">{{ mph || '--' }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ScreenOrientation, ScreenOrientationResult } from '@capacitor/screen-orientation';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { ref } from 'vue';

const mph = ref()
const dynamicFontSize = ref(calculateFontSize())

// keepAwake returns a promise but we don't actually care when it's done.
// Pretending it's synchronous makes the code slightly simpler.
KeepAwake.keepAwake()

function calculateFontSize() {
  // Each char width = .56 x height (NB varies by font)
  const computedSize = Math.floor((window.innerWidth / 3) * 1.69)
  return Math.min(computedSize, window.innerHeight) + 'px'
}

function orientationHandler(orientation: ScreenOrientationResult) {
  // Although orientation has changed, the reported window dimensions will be wrong.
  // So we add a timeout to ensure a refresh.
  // NB a vue.nextTick() won't work here, presumably because of
  // something more low level.
  setTimeout(() => {
    dynamicFontSize.value = calculateFontSize()
  }, 1000)
}

function positionHandler(position: Position | null, err: any) {
  if (err) {
    console.error(err.message);
    return;
  }
  const speed = position?.coords?.speed
  const kph = speed ? speed * 60 * 60 / 1000 : NaN;
  mph.value = Math.round(kph * 0.621371)
}

const watchOptions = {
  timeout: 500,
  enableHighAccuracy: true
};
Geolocation.watchPosition(watchOptions, positionHandler);
// Lock orientation because listener doesn't seem to fire
// all the time, resulting in display errors. In future add buttons
// to explicitly control orientation and mirroring.
ScreenOrientation.lock({ orientation: 'landscape-primary' })
// Once the lock takes effect the change event will be generated.
// Only then can we calculate the font size required.
ScreenOrientation.addListener('screenOrientationChange', orientationHandler)
</script>

<style scoped>
#display {
  font-size: v-bind('dynamicFontSize');
  margin: 0;
  line-height: 100vh;
  text-align: center;
}

.mirrorY {
  transform: scaleY(-1);
}

.mirrorX {
  transform: scaleX(-1);
}
</style>
