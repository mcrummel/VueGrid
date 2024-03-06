import EditableTable from '../demos/EditableTable.vue'
import StaticData from '../demos/StaticData.vue'
import OdataExample from '../demos/OdataExample.vue'

const path = '/demos'

export default [
  {
    name: 'editable',
    path: `${path}/editable`,
    title: 'Editable Table',
    component: EditableTable
  },
  {
    name: 'staticData',
    path: `${path}/static`,
    title: 'Static Data Example',
    component: StaticData
  },
  {
    name: 'odata',
    path: `${path}/odata`,
    title: 'Odata Example',
    component: OdataExample
  }
]
