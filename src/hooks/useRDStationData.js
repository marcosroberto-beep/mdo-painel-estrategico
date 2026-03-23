import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRDStationData() {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [stages, setStages] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      try {
        const [dealsRes, contactsRes, stagesRes, tasksRes] = await Promise.all([
          supabase.from('rdstation_deals').select('*').limit(5000),
          supabase.from('rdstation_contacts').select('*').limit(5000),
          supabase.from('rdstation_stages').select('*').order('stage_order').limit(500),
          supabase.from('rdstation_tasks').select('*').limit(5000),
        ])

        // If tables don't exist yet, errors will come back — treat as disconnected
        const hasData = !dealsRes.error && (dealsRes.data?.length > 0)

        setDeals(dealsRes.data || [])
        setContacts(contactsRes.data || [])
        setStages(stagesRes.data || [])
        setTasks(tasksRes.data || [])
        setConnected(hasData)
      } catch (err) {
        console.error('Erro ao carregar dados RD Station:', err)
        setConnected(false)
      }
      setLoading(false)
    }

    carregar()
  }, [])

  return { deals, contacts, stages, tasks, loading, connected }
}
