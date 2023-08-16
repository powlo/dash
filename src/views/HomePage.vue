<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <p id="display" class="mirrorY">{{ mph || '--' }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ScreenOrientation, ScreenOrientationResult } from '@capacitor/screen-orientation';
import { defineComponent } from 'vue';
import { KeepAwake } from '@capacitor-community/keep-awake';

export default defineComponent({
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      mph: NaN as number,
      dynamicFontSize: this.calculateFontSize() as string
    }
  },
  methods: {
    calculateFontSize() {
      const computedSize = Math.floor((window.innerWidth / 3) * 1.69)
      return Math.min(computedSize, window.innerHeight) + 'px'
    },
    orientationHandler(orientation: ScreenOrientationResult) {
      // Each char width = .56 x height (NB varies by font)
      setTimeout(() => {
        this.dynamicFontSize = this.calculateFontSize()
      }, 1000)
    },
    positionHandler(position: Position | null, err: any) {
      if (err) {
        console.error(err.message);
        return;
      }
      const speed = position?.coords?.speed
      const kph = speed ? speed * 60 * 60 / 1000 : NaN;
      this.mph = Math.round(kph * 0.621371);
    }
  },
  async mounted() {
    await KeepAwake.keepAwake()
    const watchOptions = {
      timeout: 500,
      enableHighAccuracy: true
    };
    Geolocation.watchPosition(watchOptions, this.positionHandler);
    // Lock orientation because listener doesn't seem to fire
    // all the time, resulting in display errors. In future add buttons
    // to explicitly control orientation and mirroring.
    ScreenOrientation.lock({ orientation: 'landscape-primary' })
    // Once the lock takes effect the change event will be generated.
    // Only then can we calculate the font size required.
    ScreenOrientation.addListener('screenOrientationChange', this.orientationHandler)
  }
})
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
