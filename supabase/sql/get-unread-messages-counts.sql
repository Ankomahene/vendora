CREATE OR REPLACE FUNCTION get_unread_message_counts(conversation_ids uuid[], current_user_id uuid)
RETURNS TABLE (conversation_id uuid, count bigint)
LANGUAGE sql
AS $$
  SELECT conversation_id, COUNT(*)::bigint as count
  FROM messages
  WHERE read = false 
  AND conversation_id = ANY(conversation_ids)
  AND sender_id != current_user_id
  GROUP BY conversation_id;
$$;