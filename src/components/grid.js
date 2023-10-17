import { ref } from 'vue'

function Grid (pRootUrl, pColumns, pParseResponse, pPageSize) {
  // private variables
  const _parseResponse = pParseResponse || ((data) => data)
  const _pageSize = pPageSize || 10

  // properties
  this.namespaced = true
  this.columns = ref([])
  this.data = ref([])

  const columnTemplate = {
    field: '',
    label: null,
    formatter: (value) => value,
    sortDirection: null
  }
  pColumns.forEach(c => {
    this.columns.value.push({ ...columnTemplate, ...c })
  })

  // public methods
  this.getUrl = (root, filter) => {
    return `${root}?$top=${filter.pageSize}`
  }

  this.sortRecords = (records, sort) => {
    const compare = sort.direction === 'ASC'
      ? (a, b) => a[sort.field] > b[sort.field] ? 1 : a[sort.field] < b[sort.field] ? -1 : 0
      : (a, b) => a[sort.field] < b[sort.field] ? 1 : a[sort.field] > b[sort.field] ? -1 : 0

    return records.sort(compare)
  }

  this.sort = (column) => {
    const { sortDirection } = column
    column.sortDirection =
          sortDirection === 'ASC'
            ? 'DESC'
            : sortDirection === 'DESC' ? null : 'ASC'

    const sortCommand = column.sortDirection
      ? {
          field: column.field,
          direction: column.sortDirection
        }
      : null

    this.getData(null, sortCommand)
  }

  this.getData = async (filter, sort) => {
    filter = { ...filter, pageSize: _pageSize }

    await fetch(this.getUrl(pRootUrl, filter), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((response) => response.json())
      .then(response => this.loadData(response, sort))
      .catch(console.log)
  }

  this.loadData = (responObj, sort) => {
    this.data.value = []

    const resp = _parseResponse(responObj)

    let records = resp.data
    if (sort) { records = this.sortRecords(records, sort) } else { this.clearSorts() }

    for (const record of records) {
      if (this.data.value.length >= _pageSize) { return }

      this.data.value.push(record)
    }
  }

  this.clearSorts = () => this.columns.value.forEach(c => {
    c.sortDirection = null
  })
}

export default Grid
