CREATE TABLE IF NOT EXISTS memories (id TEXT PRIMARY KEY,session_id TEXT NOT NULL,type TEXT NOT NULL,memory_key TEXT NOT NULL,value TEXT NOT NULL,importance INTEGER NOT NULL DEFAULT 2,updated_at TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS idx_memories_session_key ON memories(session_id,memory_key);
CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(session_id);
CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY,session_id TEXT NOT NULL,role TEXT NOT NULL,content TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id,created_at);