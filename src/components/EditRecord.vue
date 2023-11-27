<script setup>
import { ref } from 'vue'
import Grid from './grid'

const props = defineProps({
  inputs: { type: Array },
  data: { type: Array }
})

const fields = props.inputs.filter(_ => _.columnType !== 'command')

const emit = defineEmits(['save', 'cancel', 'load'])
const valueRefs = ref([], { deep: true })

const saveRecord = (e) => {
  const record = props.data

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
            <div v-for="{ field, title, columnType, editable } in fields" :key="field"
                class="item">
                <div>
                    <label :for="field">{{ Grid.formatTitle({ field, title, columnType }) }}</label>
                    <input type="text" :name="field" ref="valueRefs" :value="props.data[field]" :readonly="editable === false" />
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

        input[readonly] {
            background-color: #ededed;
        }
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
                    text-align: left;
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
