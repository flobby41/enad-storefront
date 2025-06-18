"use client"

import FavoriteIcon from "@/app/icons/favorite"
import { cn } from "@/lib/utils"
import { SettingsStoryblok } from "@/types/component-types-sb"
import {
  EnadCategory,
  ResponseWithPagignation,
  useEnadUser,
  useWishlist,
} from "@enadhq/commerce/enad"
import { SuperLink } from "@enadhq/commerce/storefront"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import CartSheet from "./cart-sheet"
import SearchInput from "./search-input"
import { Button } from "./ui/button"
import UserAccountDropdown from "./user-account-dropdown"

// Simple text-based logo component
export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className || ""}
    clipRule="evenodd"
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    viewBox="0 0 517 84"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="current" fillRule="nonzero" transform="scale(4.16667)">
      <path d="m45.715 19.681-4.469-18.717h3.869l2.821 12.857 3.422-12.857h4.494l3.281 13.074 2.873-13.074h3.805l-4.545 18.717h-4.009l-3.729-13.993-3.715 13.993z" />
      <path d="m70.396 10.31c0 2.119.489 3.726 1.468 4.819.979 1.094 2.222 1.641 3.728 1.641 1.507 0 2.744-.543 3.709-1.628.967-1.085 1.45-2.713 1.45-4.883 0-2.145-.47-3.745-1.41-4.8-.942-1.056-2.191-1.584-3.749-1.584-1.557 0-2.813.534-3.766 1.602s-1.43 2.68-1.43 4.833zm-3.894.128c0-1.907.285-3.507.855-4.801.426-.953 1.007-1.808 1.743-2.566.737-.757 1.543-1.319 2.419-1.685 1.167-.494 2.512-.741 4.035-.741 2.758 0 4.965.856 6.62 2.566 1.656 1.711 2.483 4.09 2.483 7.137 0 3.022-.821 5.386-2.464 7.092-1.643 1.707-3.839 2.56-6.588 2.56-2.783 0-4.996-.849-6.639-2.547-1.642-1.698-2.464-4.036-2.464-7.015z" />
      <path d="m91.221 8.88h2.796c1.813 0 2.946-.077 3.397-.23.45-.153.803-.417 1.059-.792.255-.374.383-.842.383-1.404 0-.63-.169-1.139-.505-1.526s-.81-.632-1.423-.734c-.306-.042-1.225-.064-2.757-.064h-2.95zm-3.779 10.801v-18.717h7.954c2 0 3.453.168 4.36.504.906.336 1.633.935 2.178 1.794.544.86.816 1.843.816 2.949 0 1.405-.412 2.564-1.238 3.479-.825.916-2.06 1.493-3.703 1.73.818.477 1.491 1 2.024 1.571.531.57 1.249 1.584 2.152 3.039l2.285 3.651h-4.52l-2.733-4.072c-.969-1.456-1.634-2.373-1.991-2.752s-.736-.639-1.137-.779c-.4-.14-1.034-.21-1.902-.21h-.766v7.813z" />
      <path d="m106.165 19.681v-18.717h3.779v8.312l7.635-8.312h5.081l-7.048 7.29 7.431 11.427h-4.89l-5.145-8.784-3.064 3.128v5.656z" />
      <path d="m35.687.966h-22.58l-1.854 9.878 2.94.425c.847-.954 1.774-1.404 2.807-1.404 1.774 0 2.834 1.323 2.834 3.495 0 2.278-1.06 3.708-2.728 3.708-1.377 0-2.463-1.085-2.675-2.648l-3.628.371c.45 3.231 2.808 5.19 6.277 5.19 3.707 0 6.488-2.833 6.488-6.674 0-3.628-2.463-6.329-5.8-6.329-.874 0-1.615.159-2.463.609l.556-3.231h15.667c-3.442 4.264-5.614 10.117-5.746 15.308h3.522v-.212c0-2.304.742-5.907 1.801-8.528 1.086-2.728 2.966-5.747 4.582-7.336zm-29.171 13.819v-.599c-.09.009-.157.031-.202.069-.071.058-.105.133-.105.225 0 .083.027.153.083.21s.13.089.224.095zm.206 2.205c.013.031.033.054.059.071.026.018.055.025.086.025.049 0 .089-.018.121-.054.032-.037.048-.09.048-.161 0-.07-.015-.132-.046-.187-.03-.055-.072-.095-.125-.12-.041-.02-.102-.029-.182-.029h-.066c.027.066.05.165.069.297.01.074.023.127.036.158zm-.122-1.036c.14 0 .243-.029.307-.084.065-.056.097-.126.097-.21 0-.083-.032-.154-.096-.21-.064-.057-.165-.084-.302-.084-.131 0-.23.028-.297.087-.066.057-.099.128-.099.21 0 .081.032.149.098.206.065.056.163.085.292.085zm-3.343-12.419c-1.086.874-2.304 1.589-3.257 1.907v3.284c1.774-.583 3.389-1.536 4.687-2.754v13.692h3.655v-18.698h-3.099c-.41.989-1.059 1.833-1.986 2.569zm2.861 9.658.168.062c-.026.045-.039.089-.039.134 0 .039.012.075.036.107.023.031.056.053.099.067.064.021.135.03.212.03h.56v.182h-1.07v-.163h.162c-.076-.042-.126-.08-.15-.115-.025-.037-.037-.075-.037-.118 0-.06.02-.123.059-.186zm.088.938c.097-.09.234-.136.411-.136.011 0 .027.001.048.001v.798c.118-.006.208-.04.271-.099.062-.06.093-.135.093-.224 0-.066-.017-.124-.052-.171s-.091-.084-.167-.112l.023-.187c.11.03.194.084.255.165.061.08.091.181.091.306 0 .156-.049.28-.145.372s-.232.138-.406.138c-.18 0-.32-.046-.419-.139-.1-.092-.15-.214-.15-.361 0-.144.049-.26.147-.351zm.007 1.232h-.129v-.167h.925c.167 0 .285.016.355.051.069.034.124.087.164.161.041.074.061.165.061.272 0 .128-.029.231-.086.31-.058.078-.144.116-.26.113l.026-.176c.055-.008.094-.028.119-.061.034-.045.051-.107.051-.185 0-.084-.017-.149-.051-.195-.033-.045-.08-.076-.141-.093-.037-.009-.115-.014-.233-.013.094.079.14.178.14.297 0 .147-.053.261-.159.342-.106.08-.234.121-.382.121-.102 0-.196-.018-.283-.056-.086-.037-.153-.09-.2-.161-.047-.07-.071-.152-.071-.247 0-.127.051-.231.154-.313zm-.122 1.18c.022-.057.049-.099.081-.126.033-.027.075-.045.124-.056.031-.006.087-.01.167-.01h.243c.169 0 .275-.004.32-.011.044-.007.087-.023.128-.046v.19c-.037.018-.081.03-.131.036.057.067.097.132.12.194.024.062.036.129.036.201 0 .117-.029.208-.087.27-.057.064-.13.095-.22.095-.053 0-.1-.012-.144-.035-.043-.025-.078-.056-.104-.094-.026-.039-.046-.082-.059-.131-.01-.035-.019-.09-.028-.161-.017-.147-.038-.255-.062-.324-.025 0-.041-.001-.048-.001-.074 0-.126.017-.156.051-.041.047-.061.116-.061.207 0 .086.015.149.045.189.029.041.082.071.158.091l-.024.177c-.076-.016-.137-.042-.184-.08-.047-.037-.083-.09-.108-.16s-.038-.151-.038-.243.011-.166.032-.223zm-.415 1.614h1.304v-.729h.174v.924h-1.478z" />
      <path d="m34.472 18.469c-.199-.318-.308-.436-.457-.491v-.011c.327-.019.561-.248.561-.55 0-.199-.13-.392-.308-.467-.139-.054-.234-.064-.535-.064h-.676v1.965h.318v-.833h.188c.243 0 .333.084.586.525l.174.308h.387zm-.711-.724h-.386v-.591h.362c.367 0 .501.074.501.293 0 .208-.148.298-.477.298z" />
      <path d="m33.861 16.012c-1.013 0-1.831.82-1.831 1.826 0 1.013.818 1.831 1.831 1.831 1.008 0 1.826-.818 1.826-1.831 0-1.006-.818-1.826-1.826-1.826zm0 3.356c-.844 0-1.529-.686-1.529-1.53 0-.838.685-1.523 1.529-1.523.838 0 1.523.685 1.523 1.523 0 .844-.685 1.53-1.523 1.53z" />
    </g>
  </svg>
)

export default function Sidebar({
  market,
  categories,
  settings,
}: {
  market: any
  categories: ResponseWithPagignation<EnadCategory> | null
  settings: SettingsStoryblok
}) {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const { setWishlistOpen, wishlistIds } = useWishlist()
  const { user } = useEnadUser()

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  // Check if a category is expanded
  const isCategoryExpanded = (categoryName: string) => {
    return expandedCategories.includes(categoryName)
  }

  // Render a category with its subcategories
  const renderCategory = (category: EnadCategory) => {
    const hasSubcategories = category.sub_categories && category.sub_categories.length > 0
    const isExpanded =
      isCategoryExpanded(category.uri) ||
      (pathname.includes(category.uri) && pathname.includes("/c/"))

    return (
      <li key={category.name} className={"border-b border-[#393939]"}>
        <div className="flex flex-col">
          {hasSubcategories ? (
            <div className="flex items-center justify-between w-full">
              <SuperLink
                href={`/c/${category.uri}`}
                className={`block py-2 uppercase text-sm w-full font-bold group-hover:opacity-65 hover:opacity-100 text-white opacity-100`}
              >
                {category.name}
              </SuperLink>
              <button
                onClick={() => toggleCategory(category.uri)}
                className={cn(
                  "flex items-center w-10 font-bold group-hover:opacity-65 hover:opacity-100 text-white opacity-100 uppercase text-sm cursor-pointer justify-between py-2",
                  isExpanded ? "!opacity-100" : ""
                )}
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 ml-2 transition duration-200",
                    isExpanded ? "-rotate-180" : ""
                  )}
                />
              </button>
            </div>
          ) : (
            <SuperLink
              href={`/c/${category.uri}`}
              className={`block py-2 uppercase text-sm font-bold group-hover:opacity-65 hover:opacity-100 text-white opacity-100`}
            >
              {category.name}
            </SuperLink>
          )}

          {/* Subcategories */}
          {hasSubcategories && isExpanded && (
            <div className={`mt-1 mb-3`}>
              <ul className="pl-4">
                {/* <li>
                  <SuperLink
                    href={`/c/${category.uri}`}
                    className={`block py-1.5 text-sm hover:text-white text-gray-200 uppercase`}
                  >
                    VISA ALLA {category.name.toLowerCase()}
                  </SuperLink>
                </li> */}
                {category.sub_categories.map((subcategory) => (
                  <li key={subcategory.name}>
                    <SuperLink
                      href={`/c/${subcategory.uri}`}
                      className={`block py-1.5 text-sm hover:text-white text-gray-200 uppercase`}
                    >
                      {subcategory.name}
                    </SuperLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </li>
    )
  }

  // Desktop sidebar
  return (
    <aside className="fixed top-0 left-0 h-full w-[300px] bg-black text-white z-30 flex flex-col space-y-6 pt-4">
      {/* Top icons */}
      <div className="flex justify-between items-center px-5">
        <Button
          variant="ghost"
          size="icon"
          className="relative w-auto h-auto p-2 group"
          onClick={() => setWishlistOpen(true)}
          aria-label="Favorites"
        >
          <FavoriteIcon className="h-6! w-6!" />
          {wishlistIds?.length > 0 && (
            <span className="absolute bottom-1 right-1 px-2 h-4 w-4 group-hover:text-black group-hover:bg-accent rounded-full bg-black text-xs font-medium text-white flex items-center justify-center">
              {wishlistIds?.length}
            </span>
          )}
        </Button>
        <UserAccountDropdown user={user || undefined} />
        <CartSheet market={market} />
      </div>

      {/* Logo */}
      <Link href="/" className="px-5">
        <Logo className="w-full fill-white" />
      </Link>

      {/* Search */}
      <div className="px-5">
        <SearchInput placeholder="Sök..." />
      </div>

      {/* Navigation */}
      <nav className="px-6 flex-1 overflow-y-auto">
        <ul className="space-y-1 group">
          {categories?.data.map((category) => renderCategory(category))}
        </ul>
      </nav>
    </aside>
  )
}
