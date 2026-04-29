import { useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function TokenInput({ value, onChange }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="token-input">
      <button
        type="button"
        className={`token-toggle ${show ? 'active' : ''} ${value ? 'has-token' : ''}`}
        onClick={() => setShow(s => !s)}
      >
        With Token
      </button>
      {show && (
        <input
          type="password"
          placeholder="Personal access token"
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
        />
      )}
    </div>
  )
}
