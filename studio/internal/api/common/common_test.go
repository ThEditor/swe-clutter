package common

import (
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/ThEditor/clutter-studio/internal/config"
	"github.com/google/uuid"
)

func TestHashPasswordAndCheckPasswordHash(t *testing.T) {
	hash, err := HashPassword("secret123")
	if err != nil {
		t.Fatalf("HashPassword() error = %v", err)
	}

	if !CheckPasswordHash(hash, "secret123") {
		t.Fatalf("CheckPasswordHash() = false, want true")
	}

	if CheckPasswordHash(hash, "wrong") {
		t.Fatalf("CheckPasswordHash() = true for wrong password")
	}
}

func TestGenerateRandomCode(t *testing.T) {
	code := GenerateRandomCode(6)
	if len(code) != 6 {
		t.Fatalf("GenerateRandomCode() length = %d, want 6", len(code))
	}

	allowed := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	for _, ch := range code {
		if !strings.ContainsRune(allowed, ch) {
			t.Fatalf("GenerateRandomCode() contains invalid rune %q", ch)
		}
	}
}

func TestIsYYYYMMDDDate(t *testing.T) {
	type payload struct {
		Day string `validate:"YYYYMMDDdate"`
	}

	if err := Validate.Struct(payload{Day: "2026-04-06"}); err != nil {
		t.Fatalf("Validate.Struct() error = %v, want nil", err)
	}

	if err := Validate.Struct(payload{Day: "06-04-2026"}); err == nil {
		t.Fatalf("Validate.Struct() error = nil, want validation error")
	}
}

func TestJWTAndCookies(t *testing.T) {
	config.Load()

	token, err := CreateJWT(uuid.New(), "user@example.com", true)
	if err != nil {
		t.Fatalf("CreateJWT() error = %v", err)
	}

	claims, err := VerifyToken(token)
	if err != nil {
		t.Fatalf("VerifyToken() error = %v", err)
	}

	if claims.Email != "user@example.com" || !claims.EmailVerified {
		t.Fatalf("VerifyToken() claims = %+v, want verified email", claims)
	}

	recorder := httptest.NewRecorder()
	AttachJWTCookie(recorder, token)
	if got := recorder.Result().Cookies(); len(got) != 1 || got[0].Name != "accessToken" {
		t.Fatalf("AttachJWTCookie() cookies = %+v, want accessToken cookie", got)
	}

	recorder = httptest.NewRecorder()
	DetachJWTCookie(recorder)
	if got := recorder.Result().Cookies(); len(got) != 1 || got[0].MaxAge != -1 {
		t.Fatalf("DetachJWTCookie() cookies = %+v, want expired cookie", got)
	}
}
