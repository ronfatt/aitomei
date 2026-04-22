create policy "members insert messages in owned sessions"
on public.ai_messages for insert
with check (
  public.is_admin() or exists (
    select 1
    from public.ai_chat_sessions s
    where s.id = session_id
      and s.user_id = auth.uid()
  )
);
