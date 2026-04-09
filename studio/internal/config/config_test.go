package config

import (
	"testing"
)

func TestLoadUsesEnvironmentOverrides(t *testing.T) {
	t.Setenv("APP_NAME", "test-app")
	t.Setenv("PORT", "9090")
	t.Setenv("DEBUG", "true")
	t.Setenv("DEV_MODE", "false")

	config = nil
	t.Cleanup(func() { config = nil })

	cfg := Load()
	if cfg.APP_NAME != "test-app" {
		t.Fatalf("APP_NAME = %q, want %q", cfg.APP_NAME, "test-app")
	}
	if cfg.PORT != 9090 {
		t.Fatalf("PORT = %d, want 9090", cfg.PORT)
	}
	if !cfg.DEBUG {
		t.Fatalf("DEBUG = false, want true")
	}
	if cfg.DEV_MODE {
		t.Fatalf("DEV_MODE = true, want false")
	}
}
