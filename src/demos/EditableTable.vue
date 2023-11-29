<script setup>
import VueGrid from '../components/VueGrid.vue'
import EditRecord from '../components/EditRecord.vue'
import StatesSelect from '../components/UsStateSelect.vue'
import DateInput from '../components/DateInput.vue'
import { ref, computed } from 'vue'

// data and functions related to data
let lastIndex = 0
const getNewIndex = () => ++lastIndex

// Refs
const currentRecord = ref({})
const exampleData = ref([])
const showForm = ref(false)
const formToggleClass = computed(() => showForm.value ? 'minus' : 'plus')

// grid functions
const saveData = (record) => {
  if (!record.id) {
    record.id = getNewIndex()
    exampleData.value.push({ ...record })
  } else {
    const index = exampleData.value.findIndex(_ => _.id === record.id)
    exampleData.value[index] = record
  }

  currentRecord.value = {}
}

const cancel = () => {
  currentRecord.value = {}
}

const editRecord = (row) => {
  currentRecord.value = row
  showForm.value = true
}

const deleteRecord = (recordId) => {
  const index = exampleData.value.findIndex(_ => _.id === recordId)
  exampleData.value.splice(index, 1)
}

// seed data
exampleData.value.push({
  id: getNewIndex(),
  firstName: 'Example',
  lastName: 'User',
  phoneNumber: '1235551212',
  address: '123 Street ave.',
  city: 'Springfield',
  state: 'AK',
  postalCode: '12345',
  addDate: new Date('2023-11-01T00:00:00')
})

// validators
const requiredTextFieldValidator = {
  assert: (value) => value && value.toString().length > 0,
  message: (title) => `${title} is required`
}
const phoneNumberValidator = {
  assert: (value) => value && value.toString().length === 10,
  message: (title) => `${title} must be at least ten characters`
}

// formatters
const formatDate = (value) => {
  return value && value.toLocaleDateString
    ? value.toLocaleDateString('en-us')
    : value
}
const formatPhoneNumber = (value) => {
  return value
    ? value.toString().replace(/(\d{3})(\d{3})?(\d{4})?/, '($1) $2-$3')
    : value
}
</script>

<template>
  <VueGrid name="ContactsGrid" title="Editable Table" class="grid-style"
    :dataSource="{ data: exampleData }"
    :columns="[
      { field: 'editCommand', columnType: 'command' },
      { field: 'id', columnType: Number, readonly: true, sortDirection: 'DESC' },
      { field: 'firstName', filterable: true, validator: requiredTextFieldValidator },
      { field: 'lastName', filterable: true, validator: requiredTextFieldValidator },
      { field: 'phoneNumber', columnType: Number, format: formatPhoneNumber, validator: phoneNumberValidator },
      { field: 'address', validator: requiredTextFieldValidator },
      { field: 'city', filterable: true, validator: requiredTextFieldValidator },
      { field: 'state', filterable: true, validator: requiredTextFieldValidator },
      { field: 'postalCode', validator: requiredTextFieldValidator },
      { field: 'addDate', columnType: Date, format: formatDate }
    ]">
    <template #CommandBar="grid">
      <button @click="showForm = !showForm">
        <font-awesome-icon :icon="['fas', formToggleClass]" />
      </button>
      <EditRecord id="edit-form" v-show="showForm"
        :inputs="grid.columns.value"
        :data="currentRecord"
        @save="saveData"
        @cancel="cancel()"
      >
        <template #state="{ value, updateValue }">
          <StatesSelect name="state" class="drop-down" :value="value" :onInput="updateValue" />
        </template>
        <template #addDate="{ value, updateValue }">
          <DateInput name="addDate" :value="value" :on-change="updateValue" />
        </template>
      </EditRecord>
    </template>
    <template #editCommand="row">
      <div class="edit-column">
        <button @click="editRecord(row)">
          <font-awesome-icon :icon="['fas', 'pencil']" />
        </button>
        <button @click="deleteRecord(row.id)">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </div>
    </template>
  </VueGrid>
</template>

<style scoped>
.edit-column {
  margin: auto -1rem;
  >button {
    margin: 0.1rem;
  }
}

.drop-down {
  width: 92%;
}
</style>
