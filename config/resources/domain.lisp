(in-package :mu-cl-resources)


(define-resource report ()
  :class (s-prefix "special:Report")
  :properties `(
    (:user :string ,(s-prefix "special:user"))
    (:event :string ,(s-prefix "special:event"))
    (:status :string ,(s-prefix "special:status"))
    (:timestamp :date ,(s-prefix "special:timestamp"))
    (:policy :string ,(s-prefix "special:policy"))
    (:purpose :string ,(s-prefix "special:purpose"))
    (:attributes :string-set ,(s-prefix "special:attribute"))
    )
  :resource-base (s-url "http://temporary-namespace-special/resources/reports/")
  :on-path "reports")

