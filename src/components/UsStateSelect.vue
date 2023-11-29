<template>
  <select :name="name" :value="props.value" @input="props.onInput($event.target.value)">
      <option v-for="{ label, code } of options" :key="code"
          :value="code"
          :selected="code === props.value"
      >
          {{ label }}
      </option>
  </select>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  name: String,
  value: String,
  onInput: Function
})

const options = [
  { label: 'Alabama', code: 'AL' },
  { label: 'Alaska', code: 'AK' },
  { label: 'Arizona', code: 'AZ' },
  { label: 'Arkansas', code: 'AR' },
  { label: 'American Samoa', code: 'AS' },
  { label: 'California', code: 'CA' },
  { label: 'Colorado', code: 'CO' },
  { label: 'Connecticut', code: 'CT' },
  { label: 'Delaware', code: 'DE' },
  { label: 'District of Columbia', code: 'DC' },
  { label: 'Florida', code: 'FL' },
  { label: 'Georgia', code: 'GA' },
  { label: 'Guam', code: 'GU' },
  { label: 'Hawaii', code: 'HI' },
  { label: 'Idaho', code: 'ID' },
  { label: 'Illinois', code: 'IL' },
  { label: 'Indiana', code: 'IN' },
  { label: 'Iowa', code: 'IA' },
  { label: 'Kansas', code: 'KS' },
  { label: 'Kentucky', code: 'KY' },
  { label: 'Louisiana', code: 'LA' },
  { label: 'Maine', code: 'ME' },
  { label: 'Maryland', code: 'MD' },
  { label: 'Massachusetts', code: 'MA' },
  { label: 'Michigan', code: 'MI' },
  { label: 'Minnesota', code: 'MN' },
  { label: 'Mississippi', code: 'MS' },
  { label: 'Missouri', code: 'MO' },
  { label: 'Montana', code: 'MT' },
  { label: 'Nebraska', code: 'NE' },
  { label: 'Nevada', code: 'NV' },
  { label: 'New Hampshire', code: 'NH' },
  { label: 'New Jersey', code: 'NJ' },
  { label: 'New Mexico', code: 'NM' },
  { label: 'New York', code: 'NY' },
  { label: 'North Carolina', code: 'NC' },
  { label: 'North Dakota', code: 'ND' },
  { label: 'Northern Mariana Islands', code: 'MP' },
  { label: 'Ohio', code: 'OH' },
  { label: 'Oklahoma', code: 'OK' },
  { label: 'Oregon', code: 'OR' },
  { label: 'Pennsylvania', code: 'PA' },
  { label: 'Puerto Rico', code: 'PR' },
  { label: 'Rhode Island', code: 'RI' },
  { label: 'South Carolina', code: 'SC' },
  { label: 'South Dakota', code: 'SD' },
  { label: 'Tennessee', code: 'TN' },
  { label: 'Texas', code: 'TX' },
  { label: 'Trust Territories', code: 'TT' },
  { label: 'Utah', code: 'UT' },
  { label: 'Vermont', code: 'VT' },
  { label: 'Virginia', code: 'VA' },
  { label: 'Virgin Islands', code: 'VI' },
  { label: 'Washington', code: 'WA' },
  { label: 'West Virginia', code: 'WV' },
  { label: 'Wisconsin', code: 'WI' },
  { label: 'Wyoming', code: 'WY' }
]
</script>
