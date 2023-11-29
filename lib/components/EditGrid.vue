<script setup>
import { ref, watch } from 'vue'
import Grid from '../module/grid'

const props = defineProps({
  inputs: { type: Array },
  data: { type: Array }
})

const inputs = props.inputs.filter(_ => _.columnType !== 'command').map(input => {
  return {
    validator: {
      assert: (value) => true,
      message: (title) => ''
    },
    ...input
  }
})

const emit = defineEmits(['save', 'cancel', 'load'])
const form = ref({}, { deep: true })

const loadForm = (data) => {
  if (Object.keys(data).length === 0) {
    form.value = {}
  } else {
    for (const { field } of inputs) {
      form.value[field] = props.data[field]
    }
  }

  for (const { field } of inputs) {
    removeValidationError(field)
  }
}
watch(() => props.data, loadForm, { deep: true })

const saveRecord = (e) => {
  let isValid = true
  for (const { field, validator } of inputs) {
    const value = form.value[field]
    if (validator && !validator.assert(value)) {
      isValid = false
      addValidationError(field)
    }
  }

  if (isValid) { emit('save', { ...form.value }) }
}

const addValidationError = (field) => {
  const ele = document.querySelector(`[name="${field}"]`)

  if (ele) {
    ele.closest('.form-item').classList.add('validation-error')
  }
}

const removeValidationError = (field) => {
  const ele = document.querySelector(`[name="${field}"]`)

  if (ele) {
    ele.closest('.form-item').classList.remove('validation-error')
  }
}

const getEditorType = (input) => {
  const rules = [
    { test: _ => _.editable === false, value: 'hidden' },
    { test: _ => _.columnType === Number, value: 'number' },
    // default
    { test: _ => true, value: 'text' }
  ]

  return rules.find(_ => _.test(input)).value
}

// mounted
loadForm(props.data)
</script>

<template>
    <form @submit.prevent class="edit-record-form">
        <div class="form-container">
            <div v-for="input in inputs" :key="input.field" class="item">
                <div class="form-item">
                    <label :for="input.field">
                        {{ Grid.formatTitle(input) }}
                    </label>

                    <div class="form-item-content">
                        <span v-if="$slots[input.field]" >
                            <slot :name="input.field"
                                v-bind="{
                                    value: form[input.field],
                                    updateValue: (value) => { form[input.field] = value }
                                }" />
                        </span>
                        <span v-else>
                            <input :type="getEditorType(input)" v-model="form[input.field]"
                                :name="input.field"
                                :readonly="input.readonly === true" />
                        </span>
                    </div>

                    <div class="validation-error-message">
                        {{ input.validator.message(Grid.formatTitle(input)) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="form-buttons">
            <button @click="saveRecord()">Save</button>
            <button @click="$emit('cancel')">Cancel</button>
        </div>
    </form>
</template>

<style lang="scss">
    .edit-record-form {
        background-color: #ddd;
        border-top: 2px inset #888;
        border-left: 2px inset #888;
        padding: 0.5rem;

        input[readonly] {
            background-color: #ededed;
        }

        .form-container {
            display: grid;
            grid-template-columns: auto auto auto auto auto;

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
                        width: 85%;
                    }
                }
            }
            .validation-error-message {
                color: red;
                margin: 0 0.5rem;
                display: none;
            }

            .validation-error {
                .form-item-content {
                    border: 2px solid red;
                }

                .validation-error-message {
                    display: block;
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
    }
</style>
