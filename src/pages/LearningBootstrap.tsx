import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ds } from '../services/dataSource'
import { useToast } from '../components/ToastProvider'

export default function LearningBootstrap() {
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await ds.create('bootstrap_feedback', { title, message, createdAt: new Date().toISOString() })
      showToast('Feedback saved (Bootstrap demo)', { severity: 'success' })
      setTitle('')
      setMessage('')
    } catch (err) {
      showToast('Save failed', { severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Bootstrap Demo: Submit Feedback</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-secondary me-2" type="button" onClick={() => { setTitle(''); setMessage('') }} disabled={saving}>Clear</button>
                  <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
