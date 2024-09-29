/**
 * This type is useful for debugging. If you want to see what a type resolves to, you can use this type to get the type of the type.
 * @example export type MyType = Expand<SomeType>
 * You can then hover over MyType to see what SomeType resolves to.
 * @template T The type to expand
 * @hidden
 */
export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never

/**
 * Like Expand, but expands recursively.
 * @template T The type to expand
 * @hidden
 */
export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
  ? T extends infer O
  ? { [K in keyof O]: ExpandRecursively<O[K]> }
  : never
  : T

/**
 * Returns a type that is all the properties of T and 'never' for all the properties of U.
 * @template T The type to keep properties from
 * @template U The type to remove properties from
 * @hidden
 */
export type Only<T, U> = {
  [P in keyof T]: T[P]
} & {
  [P in keyof U]?: never
}

/**
 * Creates a union type accepting either exclusively T or exclusively U.
 * @template T The first type
 * @template U The second type
 * @hidden
 */
export type Either<T, U> = Only<T, U> | Only<U, T>
