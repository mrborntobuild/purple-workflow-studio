-- Workflow execution runs
CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  input_data JSONB NOT NULL DEFAULT '{}',
  output_data JSONB DEFAULT NULL,
  started_at TIMESTAMPTZ DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  total_nodes INT NOT NULL DEFAULT 0,
  completed_nodes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Per-node execution logs
CREATE TABLE IF NOT EXISTS execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  workflow_node_id UUID NOT NULL REFERENCES workflow_nodes(id),
  node_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  input_data JSONB DEFAULT NULL,
  output_data JSONB DEFAULT NULL,
  job_id VARCHAR(255) DEFAULT NULL,
  job_model VARCHAR(255) DEFAULT NULL,
  started_at TIMESTAMPTZ DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  execution_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_user_id ON workflow_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_run_id ON execution_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_job_id ON execution_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON execution_logs(status);

-- Enable RLS
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflow_runs
CREATE POLICY "Users can view their own workflow runs"
  ON workflow_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create workflow runs"
  ON workflow_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflow runs"
  ON workflow_runs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflow runs"
  ON workflow_runs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for execution_logs (through workflow_runs)
CREATE POLICY "Users can view execution logs for their runs"
  ON execution_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workflow_runs
      WHERE workflow_runs.id = execution_logs.run_id
      AND workflow_runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create execution logs for their runs"
  ON execution_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflow_runs
      WHERE workflow_runs.id = execution_logs.run_id
      AND workflow_runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update execution logs for their runs"
  ON execution_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workflow_runs
      WHERE workflow_runs.id = execution_logs.run_id
      AND workflow_runs.user_id = auth.uid()
    )
  );
