<template>
    <input type="date" :valueAsDate="props.value" @change="handleChangeEvent" />
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  value: Date,
  onChange: {
    type: Function as PropType<(d:Date|null) => void>,
    required: true
  }
})

const handleChangeEvent = (e:Event) => {
  const d = (e.target as HTMLInputElement).valueAsDate
  d?.setMinutes(d.getMinutes() + d.getTimezoneOffset())
  props.onChange(d)
}
</script>
