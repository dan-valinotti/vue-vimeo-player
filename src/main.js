import Player from '@vimeo/player'
import assign from 'object-assign'

let pid = 0

function emitVueEvent(event) {
  this.player.on(event, (data) => {
    this.$emit(event, data, this.player)
  })
}

const eventsToEmit = [
  'play',
  'pause',
  'ended',
  'timeupdate',
  'progress',
  'seeked',
  'texttrackchange',
  'cuechange',
  'cuepoint',
  'volumechange',
  'error',
  'loaded'
]
// @vue/component
export default {
  props: {
    playerHeight: {
      default: 320
    },
    playerWidth: {
      default: 640
    },
    options: {
      default: () => ({})
    },
    videoId: {
      required: true
    },
    videoUrl: {
      default: undefined
    },
    loop: {
      default: false
    },
    autoplay: {
      default: false
    },
    controls: {
      default: true
    },
    initVolume: {
      default: 1.0,
    }
  },
  render(h) {
    return h('div', {
      attrs: {
        id: this.elementId
      }
    })
  },
  watch: {
    videoId: 'update'
  },
  data() {
    pid += 1

    return {
      elementId: `vimeo-player-${pid}`,
      player: null,
      volume: this.initVolume,
      prevVolume: this.initVolume,
    }
  },
  methods: {
    /**
     * Loads a new video ID.
     * Returns a promise
     * @param {Number} videoId
     * @return {LoadVideoPromise}
     */
    update(videoId) {
      return this.player.loadVideo(videoId)
    },
    play() {
      return this.player.play()
    },
    pause() {
      return this.player.pause()
    },
    mute() {
      return this.setVolume(0);
    },
    unmute() {
      return this.setVolume(prevVolume);
    },
    setVolume(newVolume = 1.0) {
      return this.player.getVolume()
        .then((volume) => {
          this.volume = newVolume;
          this.prevVolume = volume;
          return this.player.setVolume(newVolume);
        })
        .catch((error) => {
          vm.$emit('error', error, vm.player);
        });
    },
    setEvents() {
      const vm = this

      this.player.ready()
        .then(function () {
          vm.$emit('ready', vm.player)
        })
        .catch((error) => {
          vm.$emit('error', error, vm.player)
        })

      eventsToEmit.forEach(event => emitVueEvent.call(vm, event))
    }
  },
  mounted() {
    const options = {
      id: this.videoId,
      width: this.playerWidth,
      height: this.playerHeight,
      loop: this.loop,
      autoplay: this.autoplay,
      controls: this.controls
    }
    if (this.videoUrl) {
      options.url = this.videoUrl
    }

    this.player = new Player(this.elementId, assign(options, this.options))

    this.setEvents()
  },
  beforeDestroy() {
    this.player.unload()
  }
}