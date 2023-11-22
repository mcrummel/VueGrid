<script setup>
import VueGrid from '../components/VueGrid.vue'
import EditRecord from './EditRecord.vue'
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

// edit form related objects
const formInputs = [
  { name: 'firstName', title: 'First Name' },
  { name: 'lastName', title: 'Last Name' },
  { name: 'phoneNumber', title: 'Phone Number' },
  { name: 'address', title: 'Address' },
  { name: 'city', title: 'City' },
  { name: 'state', title: 'State' },
  { name: 'postalCode', title: 'Postal Code' }
]

const currentRecord = ref({})

const showEditForm = (record) => {
  console.log(record)
  currentRecord.value = record
}
</script>

<template>

  <Transition name="slide-fade">
    <section v-if="currentRecord.id >= 0">
      <EditRecord
      :inputs="formInputs"
      :data="currentRecord"
      @save="saveData"
      @cancel="showEditForm({})" />
    </section>
  </Transition>

  <VueGrid
    name="ContactsGrid"
    title="Editable Table"
    class="grid-style"
    :dataSource="{ data: editData }"
    :columns="[
      { field: 'editCommand', columnType: 'Command' },
      { field: 'id', columnType: Number },
      { field: 'firstName', filterable: true },
      { field: 'lastName', filterable: true },
      { field: 'phoneNumber' },
      { field: 'address' },
      { field: 'city', filterable: true },
      { field: 'state', filterable: true },
      { field: 'postalCode' }
    ]">
    <template #CommandBar>
      <button v-if="currentRecord.id === undefined" @click="showEditForm({ id: 0 })">
        <font-awesome-icon :icon="['fas', 'plus']" v-if="currentRecord.id === undefined" @click="showEditForm({ id: 0 })" />
      </button>
    </template>
    <template #editCommand="row">
      <div class="edit-column">
        <button @click="showEditForm(row)">
          <font-awesome-icon :icon="['fas', 'pencil']" />
        </button>
        <button>
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
