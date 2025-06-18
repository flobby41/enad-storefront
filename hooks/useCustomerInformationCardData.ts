import { patchSession, TAGS } from "@enadhq/commerce/brink"
import { EnadOrganisation, EnadUser, getOrganisationUsers } from "@enadhq/commerce/enad"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteCookie, getCookie } from "cookies-next"
import { useState } from "react"

export function useCustomerInformationCardData(user: EnadUser, organisations: EnadOrganisation[]) {
  const [selectedCompany, setSelectedCompany] = useState(user?.organisations?.[0]?.id)
  const isAgent = user?.organisations?.find((o) => o.id === selectedCompany)?.role === "agent"
  const [selectedUser, setSelectedUser] = useState(isAgent ? "" : user?.id)
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(
    isAgent ? "" : user?.organisations?.[0]?.billing_address[0]?.id
  )
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(
    isAgent ? "" : user?.organisations?.[0]?.shipping_address[0]?.id
  )

  const { data: organisationUsers } = useQuery({
    enabled: !!selectedCompany,
    queryFn: () => getOrganisationUsers({ id: selectedCompany }),
    queryKey: ["org", selectedCompany],
  })

  const selectedCompanyObj = organisations.find((c) => c.id === selectedCompany)
  const selectedUserObj = organisationUsers?.items?.find((u) => u.id === selectedUser)
  const selectedBillingAddressObj = selectedCompanyObj?.billing_address.find(
    (a) => a.id === selectedBillingAddress
  )
  const selectedShippingAddressObj = selectedCompanyObj?.shipping_address.find(
    (a) => a.id === selectedShippingAddress
  )

  const queryClient = useQueryClient()
  const cartToken = getCookie("cartToken")

  const clearCheckoutCache = () => {
    deleteCookie("checkoutToken")
    queryClient.removeQueries({ queryKey: [TAGS.checkout] })
  }

  const handleSelectBillingAddress = (id: string) => {
    setSelectedBillingAddress(id)
    clearCheckoutCache()
  }

  const handleSelectShippingAddress = (id: string) => {
    setSelectedShippingAddress(id)
    clearCheckoutCache()
  }

  const handleCompanyChange = async (companyId: string) => {
    setSelectedCompany(companyId)
    if (isAgent) {
      setSelectedUser("")
    }

    const company = organisations.find((c) => c.id.toString() === companyId)
    if (company) {
      const defaultBilling = company.billing_address.find((a) => a.is_default)
      const defaultShipping = company.shipping_address.find((a) => a.is_default)

      if (defaultBilling) setSelectedBillingAddress(defaultBilling.id)
      if (defaultShipping) setSelectedShippingAddress(defaultShipping.id)
    }

    if (selectedUserObj && company) {
      clearCheckoutCache()
      const newCompany = {
        registrationNumber: company?.organisation_number || "",
        taxId: company?.tax_id_vat_number || "",
        name: company?.name || "",
      }
      if (company && cartToken) await patchSession(newCompany)
    }
  }

  return {
    isAgent,
    selectedCompany,
    setSelectedCompany,
    selectedUser,
    setSelectedUser,
    selectedBillingAddress,
    handleSelectBillingAddress,
    selectedShippingAddress,
    handleSelectShippingAddress,
    selectedCompanyObj,
    selectedUserObj,
    selectedBillingAddressObj,
    selectedShippingAddressObj,
    organisationUsers: organisationUsers?.items || [],
    handleCompanyChange,
  }
}
