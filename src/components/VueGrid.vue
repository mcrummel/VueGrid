<script setup>
import Grid from './grid'

const props = defineProps({
  name: {
    type: String
  },
  title: {
    type: String
  },
  rootUrl: {
    type: String,
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

const grid = new Grid(
  props.rootUrl,
  props.columns,
  props.mapResponse,
  props.pageSize
)

// formatters
const formatTitle = (title, value) =>
  (title !== null && title !== undefined)
    ? title
    : value[0].toUpperCase() + value.slice(1)
const applyCustomFormatting = (field, row, formatter) => {
  return formatter ? formatter(row[field], row) : row[field]
}

const getPages = (pager) => {
  const pages = []
  let pageStart = 0
  let pageNumber = 0

  while ((pageStart + pager.pageSize) < pager.total && pages.length < 6) {
    pageNumber++
    pageStart += pager.pageSize

    // console.log(`${pageNumber} + ${pager.pageSize} < ${pager.total}`)
    pages.push({
      pageNumber,
      pageStart
    })
  }

  return pages
}

// created
grid.getData()
</script>

<template>
  <div @grid-created="grid.getData">
    <table :id="props.name" class="grid">
      <thead>
        <tr v-if="props.title">
          <td :colspan="grid.columns.value.length">
            <div class="grid-title">
              <span>{{ props.title }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <th v-for="column in grid.columns.value" :key="column.index" @click="grid.sort(column)">
            {{ formatTitle(column.title, column.field) }}
            <span v-if="column.sortDirection === 'ASC'">&#x2191;</span>
            <span v-else-if="column.sortDirection === 'DESC'">&#x2193;</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in grid.data.value" :key="row.id">
          <td v-for="{field, formatter} in grid.columns.value" :key="field">
            {{ applyCustomFormatting(field, row, formatter) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="grid.columns.value.length">
            <div class="pager">
              <div>
                Showing: {{ grid.pager.value.index }} to
                {{ grid.pager.value.index + grid.pager.value.pageSize }} of
                {{ grid.pager.value.total }}
              </div>
              <div>
                <span class="pageNumber arrow">
                  <a href="#">&#x2190;</a>
                </span>
                <span v-for="{ pageNumber } in getPages(grid.pager.value)" :key="pageNumber" class="pageNumber">
                  <a href="#">{{ pageNumber }}</a>
                </span>
                <span class="pageNumber arrow">
                  <a href="#">&#x2192;</a>
                </span>
              </div>
              <div>
                Page:
                <input type="text" :value="grid.pager.value.index" />
                <a href="#">Go</a>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  table {
    border-collapse: collapse;
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
  .grid-title {
    font-size: 2rem;
    font-weight: bold;
    justify-content: center;
    display:flex;
  }
  .pager {
    border: thin ridge;
    display: flex;
    justify-content: center;
    background-color: #eee;
    a, a:visited {
      color: #333
    }
  }
  .pager>div {
    display: flex;
    width: 33%;
    margin:0.2rem 1rem;
    justify-content: center;
    line-height: 2rem;
  }
  .pager>div:first-child {
    justify-content: start;
  }
  .pager>div:last-child {
    justify-content: end;
    input {
      width: 2rem;
      text-align: center;
      margin: 0 0.5rem;
    }
  }
  span.pageNumber {
    border:thin ridge;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
  }
  span.pageNumber:hover {
    background-color: #ddd;
  }

  span.arrow {
    font-size: x-large;
    line-height: 1.8rem;
  }
</style>
