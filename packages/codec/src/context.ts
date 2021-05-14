import { Codec } from './codec'

export interface ContextEntry {
  /**
   * Key pointing to the property of the object we're evaluating. Blank string at the root.
   */
  readonly key: string

  /**
   * Codec that was used at this level
   */
  readonly codec: Codec<unknown>
}

export class Context {
  /**
   * Context tracks the position of an encoding/decoding operation.
   *
   * All encoding and decoding operations require a context, and it is appended and popped as
   * we move through the data tree. Any encoder/decoder is able to access the context's current
   * state to understand where it is in the tree.
   *
   * @param entries the entries that fill this context (typically empty and filled by `.enter()` calls)
   */
  private constructor(readonly entries: ContextEntry[] = []) {}

  /**
   * Returns the current head of the context tree
   *
   * @returns the current position in the context
   */
  public get current(): ContextEntry {
    return this.entries[this.entries.length - 1]
  }

  /**
   * Returns a context with a new nested entry
   *
   * @param key the key we're entering in the context
   * @param codec the codec type that we're entering
   * @returns a new context object
   */
  public enter(key: string, codec: Codec<any>): Context {
    return new Context(
      this.entries.concat({
        key,
        codec
      })
    )
  }

  static create(codec: Codec<any>): Context {
    return new Context([
      {
        key: '',
        codec
      }
    ])
  }
}
