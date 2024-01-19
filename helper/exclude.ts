const exclude = (
    user : object,
    keys : string[]
  ) => {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    )
  }

export {
    exclude
}