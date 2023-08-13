<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <p id="display" class="mirrorX">{{ mph || '--' }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ScreenOrientation, ScreenOrientationResult } from '@capacitor/screen-orientation';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      mph: NaN as number,
      dynamicFontSize: this.calculateFontSize() as string,
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
        // Although orientation has changed, the reported window dimensions will be wrong.
        // So we add a timeout to ensure a refresh.
        // Can be done with vue.nextTick?
        const computedSize = Math.floor((window.innerWidth / 3) * 1.69)
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
  mounted() {
    const watchOptions = {
      timeout: 6000,
      enableHighAccuracy: true // may cause errors if true
    };
    Geolocation.watchPosition(watchOptions, this.positionHandler);
    ScreenOrientation.addListener('screenOrientationChange', this.orientationHandler)
  }
})
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

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
