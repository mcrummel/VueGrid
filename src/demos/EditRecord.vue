<script setup>
import { ref } from 'vue'

const props = defineProps({
  inputs: {
    type: Array
  }
})

const emit = defineEmits(['save', 'cancel'])
const valueRefs = ref([])

const saveRecord = (e) => {
  const record = {}

  for (const { name, value } of valueRefs.value) {
    record[name] = value
  }

  emit('save', record)
}
</script>

<template>
    <div>{{props.id}}</div>
    <div id="frmEditableTable">
        <div class="form-container">
            <div v-for="{ name, title } in props.inputs" :key="name"
                class="item">
                <div>
                    <label :for="name">{{ title }}</label>
                    <input type="text" :name="name" ref="valueRefs" />
                </div>
            </div>
        </div>
        <div class="form-buttons">
            <button @click="saveRecord()">Save</button>
            <button @click="$emit('cancel')">Cancel</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
    #frmEditableTable {
        background-color: #ddd;
        border-top: 2px inset #888;
        border-left: 2px inset #888;
        padding: 0.5rem;
    }
    .form-container {
        display: grid;
        grid-template-columns: auto auto auto auto;

        >div {
            >div {
                width:90%;
                margin: 0 auto;

                label {
                    display: block;
                    margin: 0.5rem 0.5rem 0 0.5rem;
                }
                input {
                    width: 90%;
                }
            }
        }
    }
    .form-buttons {
        text-align: center;
        margin-top: 1rem;

        >button {
            width: 5rem;
        }
    }
</style>
