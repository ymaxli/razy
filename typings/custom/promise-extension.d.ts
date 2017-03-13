interface Promise<T> {
    finally(callback: Function) : Promise<T>
}