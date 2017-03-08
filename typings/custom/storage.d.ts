declare interface STORAGE {
    /**
     * 设置在INITIAL_DATA_NAMESPACE下的cookie值，即这种cookie变更会在下一次刷新时自动更新到初始state中
     */
    $set(key: string, obj: any): void
    /**
     * 获取在INITIAL_DATA_NAMESPACE下的cookie值
     */
    $get(key: string): any,
    /**
     * 清除在INITIAL_DATA_NAMESPACE下的cookie值，即这种cookie变更会在下一次刷新时自动更新到初始state中
     */
    $remove(key: string): void,
    /**
     * 原生命名空间下设置cookie，即这种cookie变更不会在下一次刷新时自动更新到初始state中
     */
    set(key: string, obj: any): void,
    /**
     * 获取原生命名空间下的cookie
     */
    get(key: string): any,
    /**
     * 清除原生命名空间下设置cookie，即这种cookie变更不会在下一次刷新时自动更新到初始state中
     */
    remove(key: string): void
}