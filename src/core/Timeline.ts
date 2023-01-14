type TimelineFunc = (t: number, fromControl: boolean) => void
export default class Timeline {
  private readonly execution: TimelineFunc
  private readonly animationTime: number
  private progressElementId: string | null = null
  private progressElement: HTMLElement | null = null
  private endOfPlayCallback: (() => void) | null = null
  private time: number = 0
  private control: number = 0
  public isPlaying = false

  constructor (execution: TimelineFunc, animationTime: number) {
    this.execution = execution
    this.animationTime = animationTime
  }

  private getInjectElement (elementId: string): void {
    this.progressElement = document.getElementById(elementId)
  }

  private drawInjectedProgress (): void {
    if (this.progressElementId !== null && this.progressElement === null) {
      this.getInjectElement(this.progressElementId)
    }

    if (this.progressElement !== null) {
      const timeInMs = this.time * 20
      this.progressElement.innerHTML = `${timeInMs / 1000}s`
    }
  }

  public injectProgress (elementId: string): Timeline {
    this.progressElementId = elementId
    this.getInjectElement(elementId)
    this.drawInjectedProgress()
    return this
  }

  public setProgress (progress: number): void {
    this.pause()
    this.time = progress / 20
    this.execution(progress, true)
  }

  public pause (): void {
    clearInterval(this.control)
    this.isPlaying = false
    if (this.endOfPlayCallback !== null) {
      this.endOfPlayCallback()
    }
  }

  public handleEndOfPlay (callback: () => void): void {
    this.endOfPlayCallback = callback
  }

  public reset (): void {
    clearInterval(this.control)
    this.time = 0
    this.isPlaying = false
    this.execution(0, false)
    if (this.endOfPlayCallback !== null) {
      this.endOfPlayCallback()
    }
  }

  public play (): void {
    if (this.isPlaying) {
      return
    }
    this.isPlaying = true
    this.control = setInterval(() => {
      const timeInMs = this.time * 20
      if (timeInMs > this.animationTime) {
        clearInterval(this.control)
        this.time = 0
        this.isPlaying = false
        if (this.endOfPlayCallback !== null) {
          this.endOfPlayCallback()
        }
        return
      }
      setTimeout(() => {
        this.drawInjectedProgress()
      })
      this.execution(timeInMs, false)
      this.time++
    }, 20)
  }
}
