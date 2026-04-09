package config

import "testing"

func TestLoadUsesEnvironmentOverrides(t *testing.T) {
	t.Setenv("DATABASE_URL", "clickhouse://example:9000/db")
	t.Setenv("PORT", "8181")
	t.Setenv("DEBUG", "true")
	t.Setenv("STORAGE_MODE", "postgres")

	config = nil
	t.Cleanup(func() { config = nil })

	cfg := Load()
	if cfg.DATABASE_URL != "clickhouse://example:9000/db" {
		t.Fatalf("DATABASE_URL = %q, want override", cfg.DATABASE_URL)
	}
	if cfg.PORT != 8181 {
		t.Fatalf("PORT = %d, want 8181", cfg.PORT)
	}
	if !cfg.DEBUG {
		t.Fatalf("DEBUG = false, want true")
	}
	if cfg.STORAGE_MODE != "postgres" {
		t.Fatalf("STORAGE_MODE = %q, want postgres", cfg.STORAGE_MODE)
	}
}
