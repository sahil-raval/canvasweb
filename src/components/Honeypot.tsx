/** Hidden spam-trap field. People never see or fill it; most spam bots do. */
export function Honeypot() {
  return (
    <div aria-hidden="true" style={{position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden'}}>
      <label>
        Leave this empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}

/** Read the spam-trap value from the submitted form. */
export const honeypotValue = (form: EventTarget | null | undefined) =>
  form instanceof HTMLFormElement ? String(new FormData(form).get('website') ?? '') : ''
