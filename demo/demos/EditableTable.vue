<script setup lang="ts">
import { VueGrid, EditGrid, RawDataSource } from 'vue-grid'
import StatesSelect from '../components/UsStateSelect.vue'
import DateInput from '../components/DateInput.vue'
import { ref, computed } from 'vue'

// interfaces
interface IRecord {
  id: number
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  addDate?: Date
}

// data and functions related to data
let lastIndex = 0
const getNewIndex = (): number => ++lastIndex

// Refs
const currentRecord = ref<IRecord>({ id: 0 } satisfies IRecord)
const exampleData = ref<IRecord[]>([])
const showForm = ref(false)

const formToggleClass = computed(() => showForm.value ? 'minus' : 'plus')

// grid functions
const saveData = (record: IRecord): void => {
  if (record.id === 0) {
    record.id = getNewIndex()
    exampleData.value.push({ ...record })
  } else {
    const index = exampleData.value.findIndex(_ => _.id === record.id)
    exampleData.value[index] = record
  }

  currentRecord.value = { id: 0 }
}

const cancel = (): void => {
  currentRecord.value = { id: 0 }
}

const editRecord = (row: IRecord): void => {
  currentRecord.value = row
  showForm.value = true
}

const deleteRecord = (recordId: number): void => {
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
const dataSource = new RawDataSource(exampleData)

// validators
const requiredTextFieldValidator = {
  assert: (value: unknown) => {
    return value !== undefined &&
      typeof value === 'string' &&
      value.toString().length > 0
  },
  message: (title: string) => `${title} is required`
}
const phoneNumberValidator = {
  assert: (value: unknown) => {
    return value !== undefined &&
      typeof value === 'string' &&
      value.toString().length === 10
  },
  message: (title: string) => `${title} must be at least ten characters`
}

// formatters
const formatDate = (value: unknown): unknown => {
  const dt = value as Date

  return dt !== null && dt !== undefined
    ? dt.toLocaleDateString('en-us')
    : dt
}
const formatPhoneNumber = (value: unknown): unknown => {
  const str = value as string

  return str !== undefined
    ? str.toString().replace(/(\d{3})(\d{3})?(\d{4})?/, '($1) $2-$3')
    : str
}
</script>

<template>
  <VueGrid
    name="ContactsGrid"
    title="Editable Table"
    class="grid-style"
    :data-source="dataSource"
    :columns="[
      { field: 'editCommand', columnType: 'command' },
      { field: 'id', columnType: 'Number', readonly: true, sortDirection: 'DESC' },
      { field: 'firstName', filterable: true, validator: requiredTextFieldValidator },
      { field: 'lastName', filterable: true, validator: requiredTextFieldValidator },
      { field: 'phoneNumber', columnType: 'Number', format: formatPhoneNumber, validator: phoneNumberValidator },
      { field: 'address', validator: requiredTextFieldValidator },
      { field: 'city', filterable: true, validator: requiredTextFieldValidator },
      { field: 'state', filterable: true, validator: requiredTextFieldValidator },
      { field: 'postalCode', validator: requiredTextFieldValidator },
      { field: 'addDate', columnType: 'Date', format: formatDate }
    ]"
  >
    <template #CommandBar="grid">
      <button @click="showForm = !showForm">
        <font-awesome-icon :icon="['fas', formToggleClass]" />
      </button>
      <EditGrid
        v-show="showForm"
        id="edit-form"
        :inputs="grid.columns.value"
        :data="currentRecord"
        @save="saveData"
        @cancel="cancel()"
      >
        <template #state="{ value, updateValue }">
          <StatesSelect
            name="state"
            class="drop-down"
            :value="value"
            :on-input="updateValue"
          />
        </template>
        <template #addDate="{ value, updateValue }">
          <DateInput
            name="addDate"
            :value="value"
            :on-change="updateValue"
          />
        </template>
      </EditGrid>
    </template>
    <template #editCommand="row">
      <div class="edit-column">
        <button @click="editRecord(row as IRecord)">
          <font-awesome-icon :icon="['fas', 'pencil']" />
        </button>
        <button @click="deleteRecord((row as IRecord).id)">
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
