<script setup lang="ts">
import { ref, watch, PropType } from 'vue'
import { Grid } from '../classes/Grid'
import { IColumn } from '../interfaces/IColumn';

const props = defineProps({
  inputs: { 
    type: Array as PropType<IColumn[]>,
    required: true
  },
  data: { 
    type: Array as PropType<object[]>,
    required: true
  }
})

const inputs:IColumn[] = props.inputs.filter(_ => _.columnType !== 'command').map(input => {
  return {
    validator: {
      assert: (value: unknown) => true, // eslint-disable-line @typescript-eslint/no-unused-vars
      message: (title: string) => '' // eslint-disable-line @typescript-eslint/no-unused-vars
    },
    ...input
  }
})

const emit = defineEmits(['save', 'cancel', 'load'])
const form = ref<object>({})

const loadForm = (data: object[]) => {
  if (Object.keys(data).length === 0) {
    form.value = {}
  } else {
    for (const { field } of inputs) {
      (form.value[field as keyof object] as unknown) = props.data[field as keyof object]
    }
  }

  for (const { field } of inputs) {
    removeValidationError(field)
  }
}
watch(() => props.data , loadForm, { deep: true })

const saveRecord = () => {
  let isValid = true
  for (const { field, validator } of inputs) {
    const value = form.value[field as keyof object]
    if (validator && !validator.assert(value)) {
      isValid = false
      addValidationError(field)
    }
  }

  if (isValid) { emit('save', { ...form.value }) }
}

const addValidationError = (field: string) => {
  const ele = document.querySelector(`[name="${field}"]`)

  if (ele) {
    ele.closest('.form-item')?.classList.add('validation-error')
  }
}

const removeValidationError = (field: string) => {
  const ele = document.querySelector(`[name="${field}"]`)

  if (ele) {
    ele.closest('.form-item')?.classList.remove('validation-error')
  }
}

const getEditorType = (input: IColumn) => {
  const rules = [
    { test: (_: IColumn) => _.editable === false, value: 'hidden' },
    { test: (_: IColumn) => _.columnType === 'number', value: 'number' },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required for signature
    { test: (_: IColumn) => true, value: 'text' } /*DEFAULT*/
  ]

  return rules.find(_ => _.test(input))?.value
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
                                    value: form[input.field as keyof object],
                                    updateValue: (value: unknown) => { 
                                      (form[input.field as keyof object] as unknown) = value 
                                    }
                                }" />
                        </span>
                        <span v-else>
                            <input :type="getEditorType(input)" v-model="form[input.field as keyof object]"
                                :name="input.field"
                                :readonly="input.readonly === true" />
                        </span>
                    </div>

                    <div class="validation-error-message">
                        {{ input.validator?.message(Grid.formatTitle(input) || '') }}
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
../classes/Grid