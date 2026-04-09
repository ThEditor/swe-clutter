package routes

import "testing"

func TestValidateRequestData(t *testing.T) {
	if err := validate(RequestData{
		VisitorUserAgent: "Mozilla/5.0",
		SiteID:           "site-1",
		Page:             "/",
	}); err != nil {
		t.Fatalf("validate() error = %v, want nil", err)
	}

	if err := validate(RequestData{SiteID: "site-1", Page: "/"}); err == nil {
		t.Fatalf("validate() error = nil, want validation error")
	}
}
