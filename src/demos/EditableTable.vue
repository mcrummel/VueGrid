<script setup>
import VueGrid from '../components/VueGrid.vue'
import EditRecord from '../components/EditRecord.vue'
import { ref } from 'vue'

// data and functions related to data
let lastIndex = 0
const getNewIndex = () => ++lastIndex

const editData = ref([{
  id: getNewIndex(),
  firstName: 'Example',
  lastName: 'User',
  phoneNumber: '1235551212',
  address: '123 Street ave.',
  city: 'Springfield',
  state: 'AK',
  postalCode: '12345'
}])

// grid related properties and functions
const columns = [
  { field: 'editCommand', columnType: 'command' },
  { field: 'id', columnType: Number, editable: false, sortDirection: 'DESC' },
  { field: 'firstName', filterable: true },
  { field: 'lastName', filterable: true },
  { field: 'phoneNumber' },
  { field: 'address' },
  { field: 'city', filterable: true },
  { field: 'state', filterable: true },
  { field: 'postalCode' }
]

const currentRecord = ref({})

const saveData = (record) => {
  if (!record.id) {
    record.id = getNewIndex()
    editData.value.push(record)
  } else {
    const index = editData.value.findIndex(_ => _.id === record.id)
    editData.value[index] = record
  }

  currentRecord.value = {}
}

const editRecord = (row) => {
  currentRecord.value = row
}

const deleteRecord = (recordId) => {
  const index = editData.value.findIndex(_ => _.id === recordId)
  editData.value.splice(index, 1)
}
</script>

<template>
  <VueGrid
    name="ContactsGrid"
    title="Editable Table"
    class="grid-style"
    :dataSource="{ data: editData }"
    :columns="columns">
    <template #CommandBar>
      <button >
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
      <EditRecord
        :inputs="columns"
        :data="currentRecord"
        @save="saveData"
        @cancel="currentRecord = {}" />
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

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: scaleY(20px);
  opacity: 0;
}
</style>
