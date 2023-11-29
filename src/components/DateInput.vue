<template>
    <input type="date" :valueAsDate="props.value" @change="handleChangeEvent" />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  value: Date,
  onChange: Function
})

const handleChangeEvent = (e) => {
  const d = e.target.valueAsDate
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset())
  props.onChange(d)
}
</script>
