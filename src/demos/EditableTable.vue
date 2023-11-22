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
  if (!record.id) { record.id = getNewIndex() }

  editData.value.push(record)
  showNewInputForm.value = false
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

const showEditForm = () => {
  showNewInputForm.value = true
}

const showNewInputForm = ref(false)
</script>

<template>
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
        <button v-if="!showNewInputForm" @click="showEditForm()">Add New</button>
        <div class="edit-form" v-if="showNewInputForm">
          <EditRecord
            :inputs="formInputs"
            :values="formValues"
            @save="saveData"
            @cancel="() => showNewInputForm = false"
        />
        </div>
      </template>
      <template #editCommand>
        <!-- <button @click="this.$router.push({
          name: 'edit',
          params: { id }
        })">Edit</button> -->
      </template>
    </VueGrid>
</template>

<style scoped lang="scss">
</style>
