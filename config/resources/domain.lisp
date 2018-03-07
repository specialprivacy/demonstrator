(in-package :mu-cl-resources)


(define-resource report ()
  :class (s-prefix "special:Report")
  :properties `(
    (:log :string ,(s-prefix "special:log"))
    (:status :string ,(s-prefix "special:status"))
    (:timestamp :date ,(s-prefix "special:timestamp"))
    (:policy :string ,(s-prefix "special:policy"))
    )
  :resource-base (s-url "http://temporary-namespace-special/resources/reports/")
  :on-path "reports")

(define-resource user ()
  :class (s-prefix "foaf:Person")
  :properties `((:name :string ,(s-prefix "foaf:name")))
  :has-many `(
    (account :via ,(s-prefix "foaf:account")
      :as "accounts")
    (information :via ,(s-prefix "special:has_information")
      :as "information")
    (consent :via ,(s-prefix "special:consent_given_by")
      :inverse t
      :as "consents")
  )
  :resource-base (s-url "http://temporary-namespace-special/resources/users/")
  :on-path "users")

(define-resource account ()
  :class (s-prefix "foaf:OnlineAccount")
  :properties `((:status :string ,(s-prefix "account:status")))
  :resource-base (s-url "http://temporary-namespace-special/resources/accounts/")
  :has-one `(
    (user :via ,(s-prefix "foaf:account")
     :inverse t
     :as "user")
   )
  :on-path "accounts"
)

(define-resource data-controller ()
	:class (s-prefix "special:Data-Controller")
	:properties `(
	  (:name :string ,(s-prefix "special:name"))
	  (:logo :string ,(s-prefix "special:logo"))
	  (:address :string ,(s-prefix "special:address"))
	  (:email :string ,(s-prefix "special:email"))
	)
	:has-many `(
		(consent :via ,(s-prefix "special:consent_given_to")
      :inverse t
      :as "consents")
    (information :via ,(s-prefix "special:information_given_to")
      :inverse t
      :as "information")
	)
	:resource-base (s-url "http://temporary-namespace-special/resources/data_controller/")
	:on-path "data-controllers")

(define-resource purpose ()
	:class (s-prefix "special:Purpose")
	:properties `((:label :string ,(s-prefix "special:label")))
	:has-many `(
		(consent :via ,(s-prefix "special:with_purpose")
      :inverse t
      :as "consents")
	)
	:resource-base (s-url "http://temporary-namespace-special/resources/data_purpose/")
	:on-path "purposes")

(define-resource information ()
	:class (s-prefix "special:Information")
	:properties `(
    (:timestamp :datetime ,(s-prefix "special:timestamp"))
	  (:label :string ,(s-prefix "special:label"))
	  (:value :string ,(s-prefix "special:value"))
  )
  :has-one `(
  		(user :via ,(s-prefix "special:has_information")
  		  :inverse t
  		  :as "information-for")
      (data-controller :via ,(s-prefix "special:information_given_to")
        :as "information-given-to")
      (information-type :via ,(s-prefix "special:has_information_type")
        :as "information-type")
      (information-origin :via ,(s-prefix "special:has_information_origin")
        :as "information-origin")
  )
	:has-many `(
		(consent :via ,(s-prefix "special:consent_for")
      :inverse t
      :as "consents")
	)
	:resource-base (s-url "http://temporary-namespace-special/resources/data_information/")
	:on-path "information")

(define-resource information-type ()
	:class (s-prefix "special:InformationType")
	:properties `(
	  (:label :string ,(s-prefix "special:label"))
	  (:name :string ,(s-prefix "special:name"))
  )
  :has-one `(
      (information :via ,(s-prefix "special:has_information_type")
        :inverse t
        :as "type-for")
  )
	:resource-base (s-url "http://temporary-namespace-special/resources/data_information_type/")
	:on-path "information-types")

(define-resource information-origin ()
	:class (s-prefix "special:InformationOrigin")
	:properties `(
	  (:label :string ,(s-prefix "special:label"))
	  (:name :string ,(s-prefix "special:name"))
  )
  :has-one `(
      (information :via ,(s-prefix "special:has_information_origin")
        :inverse t
        :as "origin-for")
  )
	:resource-base (s-url "http://temporary-namespace-special/resources/data_information_origin/")
	:on-path "information-origins")

(define-resource consent ()
	:class (s-prefix "special:Consent")
	:properties `(
		(:is-given :boolean ,(s-prefix "special:consent_given"))
		(:timestamp :datetime ,(s-prefix "special:timestamp"))
	)
	:has-one `(
		(user :via ,(s-prefix "special:consent_given_by")
		  :as "given-by")
		(data-controller :via ,(s-prefix "special:consent_given_to")
		  :as "given-to")
		(purpose :via ,(s-prefix "special:with_purpose")
		  :as "purpose")
    (information :via ,(s-prefix "special:consent_for")
      :as "consent-for")
	)
	:resource-base (s-url "http://temporary-namespace-special/resources/consent/")
	:on-path "consents")
