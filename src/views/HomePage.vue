<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <p>Speed: {{ mph || '---' }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { Geolocation, Position } from '@capacitor/geolocation';

import { defineComponent } from 'vue'

const watchOptions = {
  timeout: 6000,
  enableHighAccuracy: true // may cause errors if true
};

export default defineComponent({
  components: {
    IonContent,
    IonPage,
  },
  data() {
    return {
      mph: NaN as number
    }
  },
  methods: {
    watchCallback(position: Position | null, err: any) {
      if (err) {
        console.error(err.message);
        return;
      }
      const speed = position?.coords?.speed
      const kph = speed ? speed * 60 * 60 / 1000 : NaN;
      this.mph = kph * 0.621371;
    }
  },
  mounted() {
    Geolocation.watchPosition(watchOptions, this.watchCallback);
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
</style>
