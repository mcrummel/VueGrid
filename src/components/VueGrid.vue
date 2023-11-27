<script setup>
import Grid from './grid.js'
import { computed, watch } from 'vue'

const props = defineProps({
  name: {
    type: String
  },
  title: {
    type: String
  },
  class: {
    type: String
  },
  dataSource: {
    type: Object,
    required: true
  },
  mapResponse: {
    type: Function
  },
  columns: {
    type: Array,
    required: true
  },
  pageSize: {
    type: Number
  }
})

// computed
const totalRows = computed(() => grid.pager.value.total)
const pageStart = computed(() => grid.pager.value.index)
const selectedPage = computed(() => pages.value.find(p => p.selected))
const firstPage = computed(() => pages.value[0])
const lastPage = computed(() => pages.value.slice(-1)[0])
const firstVisiblePage = computed(() => visiblePages.value[0])
const lastVisiblePage = computed(() => visiblePages.value.slice(-1)[0])

const pageEnd = computed(() => {
  const { index, pageSize, total } = grid.pager.value
  const end = index + pageSize

  return end <= total ? end : total
})

const pages = computed(() => {
  return grid.pager.value.pages
})

const visiblePages = computed(() => {
  if (pages.value.length <= 7) { return pages.value }

  const results = []
  const { pageNumber } = selectedPage.value

  const startIndex = pageNumber < 4
    ? 0
    : pageNumber > pages.value.length - 7
      ? pages.value.length - 7
      : pageNumber - 4

  for (let i = startIndex, endIndex = startIndex + 6; i <= endIndex; i++) {
    results.push(pages.value[i])
  }

  return results
})

// object instantiation
const grid = new Grid(
  props.dataSource,
  props.columns,
  props.mapResponse,
  props.pageSize
)

if ((props.dataSource.type || 'raw') === 'raw') {
  watch(() => props.dataSource.data,
    (newData) => {
      grid.loadRawData(newData)
    },
    {
      deep: true
    })
}

// formatters
const applyCustomFormatting = (field, row, formatter) =>
  formatter ? formatter(row[field], row) : row[field]

// functions
const gotoPageByPageNumber = async (pageNumber) => {
  const page = pageNumber < 1
    ? pages.value[0]
    : pageNumber > pages.value.length
      ? pages.value.slice(-1)[0]
      : pages.value.find(p => p.pageNumber === Number(pageNumber))

  await grid.gotoPage(page)
}

const search = async (searchValue) => {
  if (!searchValue || !isNaN(searchValue) || searchValue.length >= 3) {
    await grid.filterData(searchValue)
  }
}

const initialSortColumn = grid.columns.value.find(_ => _.sortDirection)
if (initialSortColumn) {
  grid.sorter = {
    field: initialSortColumn.field,
    direction: initialSortColumn.sortDirection
  }
}

// load data on created
grid.getData()
</script>

<template>
  <div :class="props.class">
    <table :id="props.name" class="grid">
      <thead>
        <!-- Title / Filter -->
        <tr v-if="props.title || props.columns.some(c => c.filterable)">
          <td :colspan="grid.columns.value.length" class="title-container">
            <div>
              <div class="title">
                <span>{{ props.title }}</span>
              </div>

              <div class="search">
                <div>
                  <input type="text" ref="txtSearch" @keypress.enter="search(this.$refs.txtSearch.value)" />
                </div>
                <div>
                  <button @click="search(this.$refs.txtSearch.value)">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                  </button>
                </div>
                <div class="link" @click="() => {
                  this.$refs.txtSearch.value = null
                  search()
                }">Clear</div>
              </div>
            </div>
          </td>
        </tr>

        <!-- Command bar -->
        <tr v-if="$slots['CommandBar']">
          <td :colspan="grid.columns.value.length" class="command-bar">
            <slot name="CommandBar" v-bind="grid" />
          </td>
        </tr>

        <!-- Column headers -->
        <tr>
          <th v-for="column in grid.columns.value" :key="column.index"
            @click="async () => {
              grid.sort(column)
              await grid.getData()
            }"
            :class="column.hidden ? 'hidden' : ''">
            {{ Grid.formatTitle(column) }}
            <span v-if="column.sortDirection === 'ASC'">&#x2191;</span>
            <span v-else-if="column.sortDirection === 'DESC'">&#x2193;</span>
          </th>
        </tr>
      </thead>

      <!-- Loading -->
      <tbody v-show="grid.loading.value">
        <tr>
          <td :colspan="grid.columns.value.length" class="loading">&nbsp;</td>
        </tr>
      </tbody>

      <!-- Table data -->
      <tbody v-show="!grid.loading.value">
        <tr v-for="row in grid.data.value" :key="row.id">
          <td v-for="column in grid.columns.value" :key="column.field"
            :class="column.hidden ? 'hidden' : ''">
            <div v-if="$slots[column.field]">
              <slot :name="column.field" v-bind="row"></slot>
            </div>
            <div v-else>
              {{ applyCustomFormatting(column.field, row, column.format) }}
            </div>
          </td>
        </tr>
      </tbody>

      <!-- Pager -->
      <tfoot>
        <tr v-if="selectedPage">
          <td :colspan="grid.columns.value.length">
            <div class="pager">
              <div>
                Showing: {{ pageStart + 1 }} to {{ pageEnd }} of {{ totalRows }}
              </div>

              <div>
                <span v-if="selectedPage.pageNumber > 1"
                  class="page-number"
                  @click="grid.previousPage()">
                  <font-awesome-icon :icon="['fas', 'chevron-left']" />
                </span>

                <span v-if="firstVisiblePage.pageNumber > 1"
                  :class="['page-number']"
                  @click="grid.gotoPage(firstPage)">
                  {{ firstPage.pageNumber }}
                </span>
                <span v-if="firstVisiblePage.pageNumber > 2">
                  ...
                </span>

                <span v-for="page in visiblePages" :key="page.pageNumber"
                  :class="['page-number', page.selected ? 'active' : '']"
                  @click="grid.gotoPage(page)">
                  {{ page.pageNumber }}
                </span>

                <span v-if="lastVisiblePage.pageNumber < pages.length - 1">
                  ...
                </span>
                <span v-if="lastVisiblePage.pageNumber < pages.length"
                  :class="['page-number']"
                  @click="grid.gotoPage(lastPage)">
                  {{ lastPage.pageNumber }}
                </span>

                <span v-if="selectedPage.pageNumber < lastPage.pageNumber"
                  class="page-number"
                  @click="grid.nextPage()">
                  <font-awesome-icon :icon="['fas', 'chevron-right']" />
                </span>
              </div>

              <div>
                Page:
                <input ref="txtPageNumber" type="text" :value="selectedPage.pageNumber"
                  @keyup.enter="gotoPageByPageNumber(this.$refs.txtPageNumber.value)" />
                <span class="link" @click="gotoPageByPageNumber(this.$refs.txtPageNumber.value)">Go</span>

                <button class="refreshButton" @click="grid.getData">
                  <font-awesome-icon :icon="['fas', 'rotate']" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  $base-color: #eee;
  $darker-color: darken($base-color, 20);
  $very-dark-color: darken($base-color, 30);

  input[type='text'] {
    border: 1px solid #aaa;
    height: 2rem;
    margin: 0.5rem;
    padding: 0.2rem 0.5rem;
  }

  .link:hover {
    cursor: pointer;
  }
  .hidden {
    display: none;
  }
  .loading {
    background: url('./assets/loading.gif') no-repeat;
    background-size: 100%;
  }
  table.grid {
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    td, th {
      border: 1px #ddd solid;
      padding: 0.5rem 1rem;
    }
    th {
      font-weight: bold;
      cursor: pointer;
    }
    tbody {
      tr:nth-of-type(odd) {
        background-color:#f9f9f9
      }
    }
    tfoot {
      td {
        padding: 0;
      }
    }
  }

  .title-container {
    background-color: $base-color;
    >div {
      display: flex;
      justify-content: space-between;
      align-content: center;
      .title {
        font-size: 2rem;
        font-weight: bold;
      }
    }
  }

  .search {
    display: grid;
    grid-template-columns: auto auto auto;

    div {
      margin: auto;

      input[type="text"] {
        margin-right:0;
      }

      button {
        border-radius: 0 0.4rem 0.4rem 0;
        margin-left:0;
        margin-right: .5rem;
        background-color: $very-dark-color;
        color: $base-color;
      }
    }
  }

  .command-bar {
    text-align: left;
    padding: 0 !important;
  }

  .pager {
    display: flex;
    justify-content: center;
    background-color: $base-color;
    .page-number {
      border:1px solid transparent;
      width: 2rem;
      height: 2rem;
      font-weight: 600;
      cursor: pointer;
    }
    .active {
      background-color: $very-dark-color;
      color: #fff
    }
    .page-number:hover {
      background-color: $darker-color;
    }

    >div {
      display: flex;
      width: 33%;
      margin:0.2rem 1rem;
      justify-content: center;
      align-items: center;
      line-height: 2rem;
    }
    >div:first-child {
      justify-content: start;
    }
    >div:last-child {
      justify-content: end;
      input {
        width: 2rem;
        text-align: center;
        margin: 0 0.5rem;
      }

      .refreshButton {
        margin-left:2rem;
      }
    }
  }
</style>
