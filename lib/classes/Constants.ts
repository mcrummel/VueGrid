class DataSourceTypes {
    public static get RAW(): string { return 'raw' }
    public static get ODATA(): string { return 'odata' }
}
 
class Directions {
    public static get ASCENDING(): string { return  'ASC' }
    public static get DESCENDING(): string { return  'DESC' }
}

class Operators {
    public static get EQUALS(): string { return 'eq' }
    public static get CONTAINS(): string { return 'contains' }
}

export { DataSourceTypes, Directions, Operators }