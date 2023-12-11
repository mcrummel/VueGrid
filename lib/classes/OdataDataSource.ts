import { IColumn } from '../interfaces/IColumn'
import { IFilter } from '../interfaces/IFilter'
import { IPager } from '../interfaces/IPager'
import { ISorter } from '../interfaces/ISorter'
import { IGridDataSource } from '../interfaces/IGridDataSource'
import { Utility } from './Utility'
import { Operators } from './Constants' 
import { IDataSet } from '../interfaces/IDataSet'

interface IOdataQuery {
  $count?: boolean,
  $select?: string,
  $skip?: number,
  $top?: number,
  $filter?: string,
  $orderby?: string
}

class OdataDataSource implements IGridDataSource {
    private readonly responseMap: (data: unknown) => IDataSet

    constructor(
      rootUrl: string, 
      responseMap: (data: unknown) => IDataSet
    ) {
        this.rootUrl = rootUrl
        this.responseMap = responseMap
    }

    // public properties
    public rootUrl: string

    // functions
    public getData = async (
      columns?: IColumn[], 
      pager?: IPager,
      sorter?: ISorter,
      filters?: IFilter[]
    ) => {
        const query: IOdataQuery = {
          $count: true
        }

        if (columns) {
          query.$select = columns
            .filter(c => !Utility.strIsNullOrWhitespace(c.field))
            .map(c => c.field)
            .join(',')
        }
    
        // paging
        if (pager) {
          if (pager.pageSize) { query.$top = pager.pageSize }
          if (pager.index) { query.$skip = pager.index }
        }
    
        // sorting
        if (sorter) { query.$orderby = `${sorter.field} ${sorter.direction}` }
    
        // filtering
        if (filters && filters.length > 0) {
          query.$filter = filters.map(({ field, searchValue, operator }) => {
            let filter
    
            switch (operator) {
              case Operators.CONTAINS: {
                const cleanValue = this.cleanSearchValue(searchValue.toString())
                filter = `contains(${field}, '${cleanValue}')`
                break
              }
              case Operators.EQUALS:{
                filter = `${field} eq ${searchValue}`
                break
              }
            }
    
            return filter
          }).join(' or ')
        }
    
        const strQuery = Object.entries(query)
          .map(([key, value]) => {
            return `${key}=${value}`
          })
          .join('&')
    
        const url = `${this.rootUrl}?${strQuery}`

        return fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
          .then((response) => response.json())
          .then(response => this.responseMap(response))
      }

      private cleanSearchValue = (value: string) => value.replace(/[']/g, "''")
}

export { OdataDataSource }