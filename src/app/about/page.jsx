"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const DATA = [
    {
      title: "Pristine, Cheerful Trucks",
      desc: "Our spotless, eye-catching trucks are as inviting as the ice cream they serve.",
      icon: (
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32.5669 8.17578H4.33834C3.50634 8.17578 2.85263 8.8295 2.85263 9.6615V27.4901C2.85263 28.3072 3.50634 28.9758 4.33834 28.9758H32.5669C33.3841 28.9758 34.0526 28.3072 34.0526 27.4901V9.6615C34.0526 8.8295 33.3841 8.17578 32.5669 8.17578ZM2.83777 36.4044C2.83777 37.2215 3.50634 37.8901 4.32348 37.8901H5.92805C6.55205 34.7849 9.10748 32.3484 12.2869 31.9472H4.33834C3.80348 31.9472 3.3132 31.8581 2.83777 31.6798V36.4044Z"
            fill="#00334E"
          />
          <path
            d="M45.8346 37.8902H47.6769C48.4941 37.8902 49.1626 37.2216 49.1626 36.4045V23.3896C49.1626 21.0571 43.4723 15.6045 40.3523 15.6045H37.0243V27.4902C37.0243 29.9416 35.0186 31.9473 32.5672 31.9473H14.2186C17.3981 32.3485 19.9535 34.7851 20.5775 37.8902H31.1855C31.8689 34.4731 34.8849 31.8731 38.5101 31.8731C42.1203 31.8731 45.1512 34.4731 45.8346 37.8902ZM39.4609 19.2593C47.0678 18.8879 46.7558 26.7473 46.7558 26.7473H39.4609V19.2593Z"
            fill="#00334E"
          />
          <path
            d="M38.5033 43.8241C40.9814 43.8241 42.9902 41.8152 42.9902 39.3372C42.9902 36.8592 40.9814 34.8503 38.5033 34.8503C36.0253 34.8503 34.0165 36.8592 34.0165 39.3372C34.0165 41.8152 36.0253 43.8241 38.5033 43.8241Z"
            fill="#00334E"
          />
          <path
            d="M13.2466 43.8241C15.7246 43.8241 17.7335 41.8152 17.7335 39.3372C17.7335 36.8592 15.7246 34.8503 13.2466 34.8503C10.7686 34.8503 8.75977 36.8592 8.75977 39.3372C8.75977 41.8152 10.7686 43.8241 13.2466 43.8241Z"
            fill="#00334E"
          />
        </svg>
      ),
    },
    {
      title: "A Sweet Selection for Everyone",
      desc: "From nostalgic classics to creamy favorites, there’s a treat for every taste bud.",
      icon: (
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35.2547 8.25504C35.1258 8.55857 34.9366 8.8328 34.6987 9.06112C34.4607 9.28944 34.1789 9.4671 33.8703 9.58335C33.5617 9.69959 33.2327 9.75201 32.9033 9.73743C32.5738 9.72285 32.2508 9.64157 31.9536 9.49851C31.6565 9.35545 31.3915 9.15358 31.1747 8.90513C30.9578 8.65669 30.7936 8.36682 30.6921 8.05308C30.5905 7.73934 30.5536 7.40825 30.5837 7.07986C30.6138 6.75146 30.7103 6.43259 30.8672 6.14254C31.3538 5.13143 31.9389 4.17075 32.614 3.27441C32.4602 3.25819 32.3056 3.25005 32.1509 3.25004C30.8505 3.24547 29.5863 3.67762 28.5608 4.47722C27.5353 5.27683 26.808 6.39758 26.4954 7.65983C26.1828 8.92208 26.3031 10.2527 26.8369 11.4385C27.3707 12.6242 28.2872 13.5964 29.4394 14.1992C30.5917 14.802 31.9129 15.0005 33.1914 14.7629C34.4699 14.5252 35.6316 13.8652 36.4902 12.8887C37.3489 11.9121 37.8548 10.6755 37.9269 9.37715C37.999 8.07877 37.6331 6.79378 36.8878 5.72816C36.2372 6.49685 35.6883 7.34612 35.2547 8.25504Z"
            fill="#00334E"
          />
          <path
            d="M39.5915 1.41612C39.564 1.31272 39.5164 1.21575 39.4514 1.13079C39.3864 1.04583 39.3053 0.974536 39.2126 0.921013C39.12 0.86749 39.0177 0.832786 38.9117 0.818892C38.8056 0.804999 38.6978 0.812191 38.5945 0.840054C35.2243 1.7338 33.2215 4.98868 32.3269 6.84768C32.2448 7.03998 32.2401 7.25652 32.3136 7.45224C32.3871 7.64796 32.5333 7.80781 32.7216 7.89854C32.91 7.98927 33.1261 8.0039 33.325 7.93937C33.5238 7.87485 33.6902 7.73615 33.7894 7.55212C34.5621 5.94418 36.2683 3.13862 39.0097 2.4098C39.1133 2.38296 39.2105 2.33592 39.2959 2.2714C39.3812 2.20687 39.4529 2.12613 39.507 2.0338C39.561 1.94147 39.5963 1.83938 39.6108 1.73338C39.6253 1.62738 39.6187 1.51957 39.5915 1.41612Z"
            fill="#00334E"
          />
          <path
            d="M42.7541 18.0861C42.2422 17.9805 42.1691 17.8992 42.0391 17.363C41.5236 15.1526 40.5674 13.0689 39.2278 11.2367C38.9088 12.2706 38.3673 13.2221 37.6414 14.0245C36.9155 14.8268 36.0228 15.4605 35.0259 15.8811C34.029 16.3017 32.9521 16.499 31.8708 16.4591C30.7896 16.4192 29.7302 16.1431 28.767 15.6502C27.8038 15.1573 26.9602 14.4595 26.2953 13.6058C25.6305 12.7522 25.1606 11.7633 24.9187 10.7088C24.6767 9.65418 24.6685 8.55941 24.8947 7.50132C25.1208 6.44323 25.5759 5.44748 26.2278 4.58397C22.4222 4.4933 18.7052 5.73921 15.723 8.10508C12.7408 10.4709 10.6821 13.8071 9.90471 17.5336C9.81534 17.9155 9.77471 17.9561 9.43346 18.0211C7.5174 18.324 5.76536 19.2811 4.47521 20.7297C3.18507 22.1784 2.43643 24.0291 2.35659 25.9673C1.86909 32.1627 9.37334 36.6923 14.6741 33.5398C17.9891 36.7963 22.1491 37.2416 25.9516 34.5717C27.4829 35.6642 29.3039 36.2778 31.1841 36.3348C32.3324 36.2999 33.4625 36.0386 34.5096 35.5659C35.5567 35.0932 36.5002 34.4185 37.286 33.5805C42.6485 36.7931 50.1397 32.118 49.6522 25.9348C49.5697 24.0361 48.8407 22.2226 47.586 20.7951C46.3314 19.3675 44.6265 18.4117 42.7541 18.0861Z"
            fill="#00334E"
          />
          <path
            d="M37.5702 35.4981C37.2509 35.7664 36.917 36.0168 36.57 36.2481L34.2187 46.7943C34.1985 46.9014 34.157 47.0033 34.0966 47.094C34.0362 47.1847 33.9582 47.2624 33.8672 47.3223C33.7762 47.3823 33.6741 47.4233 33.567 47.443C33.4598 47.4627 33.3498 47.4606 33.2434 47.4369C33.1371 47.4132 33.0366 47.3683 32.9479 47.305C32.8592 47.2416 32.7842 47.1611 32.7273 47.0682C32.6704 46.9752 32.6328 46.8718 32.6167 46.7641C32.6005 46.6563 32.6063 46.5464 32.6335 46.4409L34.6785 37.2653C33.5699 37.7208 32.3834 37.9567 31.1848 37.96C29.6791 37.9488 28.1952 37.5983 26.8436 36.9346V46.3125C26.8436 46.528 26.758 46.7347 26.6056 46.887C26.4533 47.0394 26.2466 47.125 26.0311 47.125C25.8156 47.125 25.6089 47.0394 25.4566 46.887C25.3042 46.7347 25.2186 46.528 25.2186 46.3125V36.8875C23.8546 37.5728 22.351 37.9342 20.8246 37.9438C19.6463 37.9411 18.4793 37.7127 17.3869 37.271L19.4377 46.4401C19.4641 46.5453 19.4692 46.6547 19.4526 46.7619C19.4361 46.869 19.3982 46.9718 19.3414 47.0642C19.2845 47.1565 19.2097 47.2365 19.1214 47.2995C19.0331 47.3624 18.933 47.4071 18.8272 47.4308C18.7214 47.4545 18.6119 47.4568 18.5052 47.4375C18.3984 47.4182 18.2966 47.3778 18.2058 47.3185C18.115 47.2593 18.0369 47.1824 17.9762 47.0926C17.9155 47.0027 17.8735 46.9015 17.8525 46.7951L15.4962 36.2741C15.112 36.0233 14.7425 35.7507 14.3896 35.4575C13.2162 35.9381 11.9607 36.1865 10.6927 36.1888C9.78611 36.1871 8.88399 36.0613 8.01147 35.815L10.8877 48.2544C11.1598 49.1181 11.7042 49.8705 12.4393 50.3992C13.1745 50.9279 14.0611 51.2045 14.9665 51.1875H37.034C37.9405 51.2045 38.8281 50.9269 39.5635 50.3966C40.2989 49.8663 40.8425 49.1118 41.1127 48.2463L43.9727 35.8556C41.8612 36.4784 39.5993 36.3521 37.5702 35.4981Z"
            fill="#00334E"
          />
        </svg>
      ),
    },
    {
      title: "Friendly, Professional Drivers",
      desc: "Our team ensures your event runs smoothly with charm and fun.",
      icon: (
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.1809 12.4812V11.6989C23.3612 10.8762 28.6388 10.8762 33.819 11.6989V12.4812C28.6223 11.9046 23.3777 11.9046 18.1809 12.4812ZM16.3063 13.3463C15.9995 13.7131 16.0665 14.7762 16.5581 15.4024C16.8223 15.7391 17.1289 15.8528 17.49 15.7485C17.301 14.9609 17.1927 14.1568 17.1703 13.3596C16.8545 13.2143 16.4921 13.1242 16.3063 13.3463ZM34.1536 10.7234L36.4394 8.4852C36.5983 8.32971 36.6656 8.13887 36.6396 7.91818C36.6136 7.69738 36.5038 7.52746 36.3132 7.41311L27.2689 1.98642C26.8657 1.7445 26.4328 1.62354 25.9998 1.62354C25.5669 1.62354 25.1341 1.7445 24.7309 1.98642L15.6866 7.41311C15.496 7.52736 15.3861 7.69738 15.3602 7.91807C15.3342 8.13887 15.4016 8.32971 15.5604 8.4851L17.8463 10.7234C23.2584 9.84624 28.7417 9.84624 34.1536 10.7234ZM34.5099 15.7485C34.8672 15.8517 35.1711 15.7411 35.4336 15.4128C35.9301 14.7915 36.0027 13.7241 35.6966 13.35C35.5105 13.1226 35.1423 13.2162 34.8296 13.3597C34.8071 14.1569 34.6988 14.9609 34.5099 15.7485ZM26.7627 29.313C27.9972 29.397 29.2085 29.6891 30.3456 30.1771L33.1105 24.2217L31.2087 23.5946L26.7628 29.313H26.7627ZM37.0082 39.3658H43.3676V31.9646C43.3676 29.2749 41.6404 27.0346 38.8598 26.1177L34.0815 24.5419L31.2597 30.62C34.437 32.3467 36.6773 35.5868 37.0082 39.3658ZM20.74 30.62L17.9181 24.5419L13.1397 26.1177C10.3592 27.0345 8.63184 29.2749 8.63184 31.9646V39.3658H14.9914C15.3223 35.5868 17.5625 32.3468 20.7399 30.62H20.74ZM18.7952 13.4349C20.7703 15.1845 23.3424 16.1714 25.9998 16.1714C28.6573 16.1714 31.2293 15.1845 33.2044 13.4349C28.4141 12.9385 23.5854 12.9385 18.7952 13.4349ZM25.237 29.313L20.7911 23.5946L18.8892 24.2217L21.6542 30.1771C22.7912 29.6891 24.0026 29.397 25.2371 29.313H25.237ZM25.9997 22.3563C30.3761 22.3563 33.2413 18.3895 33.7407 14.3144C31.5997 16.1526 28.8445 17.1871 25.9997 17.1871C23.155 17.1871 20.3998 16.1527 18.2587 14.3144C18.7581 18.3895 21.6234 22.3563 25.9997 22.3563ZM30.413 22.0137C29.1645 22.8628 27.681 23.3719 25.9997 23.3719C24.3405 23.3719 22.8738 22.8758 21.6356 22.0467L21.5077 22.8619L25.9997 28.6396L30.501 22.85L30.413 22.0138V22.0137ZM25.9997 38.4892C24.9804 38.4892 24.1511 39.3186 24.1511 40.3378C24.1511 41.3571 24.9805 42.1865 25.9997 42.1865C27.019 42.1865 27.8484 41.3572 27.8484 40.3378C27.8484 39.3185 27.019 38.4892 25.9997 38.4892ZM36.0357 40.3378C36.0357 45.8717 31.5336 50.3738 25.9997 50.3738C20.4659 50.3738 15.9637 45.8717 15.9637 40.3378C15.9637 34.804 20.4659 30.3018 25.9997 30.3018C31.5336 30.3018 36.0357 34.804 36.0357 40.3378ZM34.3619 38.967C34.0424 37.0046 33.0313 35.207 31.5149 33.9055C29.9816 32.5894 28.023 31.8647 25.9998 31.8647C23.9767 31.8647 22.018 32.5894 20.4847 33.9055C18.9683 35.2071 17.9571 37.0047 17.6377 38.967C17.6259 39.0396 17.63 39.1139 17.6498 39.1848C17.6695 39.2557 17.7044 39.3214 17.7521 39.3774C17.7998 39.4335 17.8591 39.4785 17.9258 39.5094C17.9926 39.5403 18.0653 39.5563 18.1389 39.5563H23.2448C23.1742 39.8049 23.1355 40.0669 23.1355 40.3377C23.1355 40.6086 23.1741 40.8705 23.2448 41.1192H18.1385C18.0649 41.1192 17.9922 41.1352 17.9254 41.1661C17.8586 41.197 17.7994 41.242 17.7517 41.298C17.704 41.3541 17.6691 41.4198 17.6494 41.4907C17.6296 41.5616 17.6255 41.6359 17.6373 41.7085C17.921 43.4604 18.7491 45.0785 20.004 46.3333C21.2589 47.5882 22.8771 48.4162 24.6289 48.6998C24.7016 48.7116 24.7759 48.7075 24.8468 48.6877C24.9177 48.668 24.9834 48.633 25.0394 48.5854C25.0955 48.5377 25.1405 48.4784 25.1714 48.4116C25.2023 48.3449 25.2183 48.2722 25.2183 48.1986V43.0927C25.4669 43.1633 25.7289 43.202 25.9997 43.202C26.2706 43.202 26.5326 43.1634 26.7812 43.0927V48.1986C26.7812 48.2722 26.7972 48.3449 26.8281 48.4116C26.8589 48.4784 26.904 48.5377 26.96 48.5854C27.0161 48.633 27.0818 48.668 27.1527 48.6877C27.2236 48.7075 27.2979 48.7116 27.3705 48.6998C29.1224 48.4162 30.7405 47.5882 31.9955 46.3333C33.2504 45.0785 34.0785 43.4604 34.3622 41.7085C34.374 41.6359 34.3699 41.5616 34.3501 41.4907C34.3304 41.4198 34.2954 41.3541 34.2478 41.298C34.2001 41.242 34.1408 41.197 34.074 41.1661C34.0073 41.1352 33.9346 41.1192 33.861 41.1192H28.7547C28.8253 40.8705 28.864 40.6087 28.864 40.3377C28.864 40.0668 28.8254 39.8048 28.7547 39.5563H33.8606C33.9342 39.5563 34.0068 39.5403 34.0736 39.5094C34.1404 39.4785 34.1997 39.4335 34.2474 39.3774C34.295 39.3214 34.33 39.2557 34.3497 39.1848C34.3695 39.1139 34.3736 39.0396 34.3618 38.967H34.3619ZM25.9998 32.8803C22.5274 32.8803 19.5726 35.227 18.7601 38.5407H23.7717C24.2971 37.8904 25.1005 37.4735 25.9997 37.4735C26.899 37.4735 27.7023 37.8904 28.2278 38.5407H33.2394C32.4269 35.227 29.4722 32.8803 25.9997 32.8803H25.9998Z"
            fill="#00334E"
          />
        </svg>
      ),
    },
    {
      title: "Easy to Book",
      desc: "We’ve made it simple to schedule your visit. Just reach out.",
      icon: (
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_0_3770)">
            <path
              d="M7.95449 6.13665H7.95011C7.7079 6.13613 7.468 6.1836 7.24423 6.2763C7.02047 6.36901 6.81729 6.50513 6.64643 6.67679C6.47222 6.84968 6.3341 7.05546 6.24009 7.28217C6.14607 7.50889 6.09803 7.75202 6.09876 7.99745V35.8998C6.09876 36.923 6.93444 37.7575 7.96184 37.7601C12.2931 37.7704 19.5496 38.6732 24.5557 43.9119V14.7113C24.5557 14.3644 24.4671 14.0386 24.2999 13.7689C20.1912 7.15214 12.2955 6.14681 7.95449 6.13665ZM45.9015 35.8998V7.99728C45.9015 7.49794 45.707 7.02889 45.3538 6.67661C45.183 6.505 44.9798 6.36891 44.7561 6.2762C44.5323 6.1835 44.2925 6.13601 44.0503 6.13648H44.0458C39.7049 6.14681 31.8093 7.15214 27.7004 13.7689C27.5332 14.0386 27.4447 14.3644 27.4447 14.7113V43.9117C32.4508 38.673 39.7073 37.7703 44.0386 37.7599C45.0658 37.7573 45.9015 36.9229 45.9015 35.8998Z"
              fill="#00334E"
            />
            <path
              d="M50.1395 12.5713H48.7903V35.8998C48.7903 38.5122 46.6618 40.6425 44.0454 40.6489C40.3716 40.6577 34.314 41.3761 30.0239 45.4364C37.4436 43.6198 45.2654 44.8007 49.723 45.8166C49.9961 45.8795 50.2799 45.8799 50.5531 45.8176C50.8263 45.7554 51.0819 45.632 51.3007 45.4569C51.5194 45.2832 51.696 45.0622 51.8171 44.8105C51.9382 44.5588 52.0007 44.2829 52 44.0036V14.4317C52.0002 13.4059 51.1654 12.5713 50.1395 12.5713ZM3.20965 35.8998V12.5713H1.86045C0.834804 12.5713 0 13.4059 0 14.4317V44.003C0 44.5721 0.254923 45.1019 0.699289 45.4564C0.918033 45.6316 1.17362 45.755 1.44687 45.8173C1.72011 45.8795 2.00392 45.8791 2.27698 45.816C6.73464 44.8 14.5565 43.6192 21.9759 45.4359C17.686 41.3757 11.6284 40.6575 7.95463 40.6488C5.33833 40.6425 3.20965 38.5122 3.20965 35.8998Z"
              fill="#00334E"
            />
          </g>
          <defs>
            <clipPath id="clip0_0_3770">
              <rect width="52" height="52" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      title: "Need a Custom Menu?",
      desc: "We can accommodate your needs with ease.",
      icon: (
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44.4693 4.3873C43.6069 3.523 42.4598 3.04688 41.2395 3.04688H39.2138V5.07812C39.2138 7.31819 37.3934 9.14062 35.1558 9.14062H16.8948C14.6572 9.14062 12.8368 7.31819 12.8368 5.07812V3.04688H10.8044C8.28994 3.04688 6.24203 5.09478 6.23919 7.61211L6.19532 47.4246C6.19389 48.6463 6.66819 49.7952 7.53056 50.6596C8.39313 51.524 9.54017 52 10.7605 52H41.1955C43.71 52 45.758 49.9521 45.7607 47.4348L45.8047 7.62227C45.8061 6.40057 45.3318 5.2517 44.4693 4.3873ZM26.5174 18.2812H37.329C38.1694 18.2812 38.8507 18.9633 38.8507 19.8047C38.8507 20.646 38.1694 21.3281 37.329 21.3281H26.5174C25.6769 21.3281 24.9957 20.646 24.9957 19.8047C24.9957 18.9633 25.6769 18.2812 26.5174 18.2812ZM26.5174 28.4375H37.329C38.1694 28.4375 38.8507 29.1196 38.8507 29.9609C38.8507 30.8023 38.1694 31.4844 37.329 31.4844H26.5174C25.6769 31.4844 24.9957 30.8023 24.9957 29.9609C24.9957 29.1196 25.6769 28.4375 26.5174 28.4375ZM26.5174 38.5938H37.3725C38.2129 38.5938 38.8942 39.2758 38.8942 40.1172C38.8942 40.9585 38.2129 41.6406 37.3725 41.6406H26.5174C25.6769 41.6406 24.9957 40.9585 24.9957 40.1172C24.9957 39.2758 25.6769 38.5938 26.5174 38.5938ZM13.5516 18.3414C14.1459 17.7464 15.1094 17.7464 15.7037 18.3414L16.5311 19.1698L20.0405 15.6566C20.6349 15.0617 21.5983 15.0615 22.1925 15.6566C22.7868 16.2514 22.7868 17.2161 22.1925 17.811L17.6071 22.4014C17.4658 22.5429 17.2981 22.6551 17.1135 22.7317C16.9288 22.8082 16.7309 22.8476 16.531 22.8476C16.3311 22.8476 16.1332 22.8082 15.9486 22.7317C15.7639 22.6551 15.5962 22.5429 15.455 22.4014L13.5515 20.4957C12.9572 19.9009 12.9572 18.9362 13.5516 18.3414ZM13.5516 29.2733C14.1459 28.6783 15.1094 28.6783 15.7037 29.2733L16.5311 30.1016L20.0405 26.5884C20.6348 25.9935 21.5983 25.9935 22.1925 26.5884C22.7868 27.1832 22.7868 28.1478 22.1925 28.7428L17.6071 33.3333C17.4658 33.4747 17.2981 33.5869 17.1135 33.6635C16.9288 33.74 16.7309 33.7794 16.531 33.7794C16.3311 33.7794 16.1332 33.74 15.9486 33.6635C15.764 33.5869 15.5962 33.4747 15.455 33.3333L13.5515 31.4276C12.9572 30.8328 12.9572 29.8682 13.5516 29.2733ZM13.5516 39.4295C14.1459 38.8346 15.1094 38.8346 15.7037 39.4295L16.5311 40.2579L20.0405 36.7446C20.6348 36.1497 21.5983 36.1497 22.1925 36.7446C22.7868 37.3395 22.7868 38.3041 22.1925 38.899L17.6071 43.4896C17.4658 43.631 17.2981 43.7432 17.1135 43.8197C16.9288 43.8963 16.7309 43.9357 16.531 43.9357C16.3311 43.9357 16.1332 43.8963 15.9486 43.8197C15.764 43.7432 15.5962 43.631 15.455 43.4896L13.5515 41.5839C12.9572 40.989 12.9572 40.0245 13.5516 39.4295Z"
            fill="#00334E"
          />
          <path
            d="M15.8809 5.07812C15.8809 5.63905 16.335 6.09375 16.8954 6.09375H35.1563C35.7166 6.09375 36.1708 5.63905 36.1708 5.07812V1.01562C36.1708 0.454695 35.7166 0 35.1563 0H16.8954C16.335 0 15.8809 0.454695 15.8809 1.01562V5.07812Z"
            fill="#00334E"
          />
        </svg>
      ),
    },
    {
      title: "We Handle Everything",
      desc: "From setup to clean-up, we take care of it all.",
      icon: (
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44.4693 4.3873C43.6069 3.523 42.4598 3.04688 41.2395 3.04688H39.2138V5.07812C39.2138 7.31819 37.3934 9.14062 35.1558 9.14062H16.8948C14.6572 9.14062 12.8368 7.31819 12.8368 5.07812V3.04688H10.8044C8.28994 3.04688 6.24203 5.09478 6.23919 7.61211L6.19532 47.4246C6.19389 48.6463 6.66819 49.7952 7.53056 50.6596C8.39313 51.524 9.54017 52 10.7605 52H41.1955C43.71 52 45.758 49.9521 45.7607 47.4348L45.8047 7.62227C45.8061 6.40057 45.3318 5.2517 44.4693 4.3873ZM26.5174 18.2812H37.329C38.1694 18.2812 38.8507 18.9633 38.8507 19.8047C38.8507 20.646 38.1694 21.3281 37.329 21.3281H26.5174C25.6769 21.3281 24.9957 20.646 24.9957 19.8047C24.9957 18.9633 25.6769 18.2812 26.5174 18.2812ZM26.5174 28.4375H37.329C38.1694 28.4375 38.8507 29.1196 38.8507 29.9609C38.8507 30.8023 38.1694 31.4844 37.329 31.4844H26.5174C25.6769 31.4844 24.9957 30.8023 24.9957 29.9609C24.9957 29.1196 25.6769 28.4375 26.5174 28.4375ZM26.5174 38.5938H37.3725C38.2129 38.5938 38.8942 39.2758 38.8942 40.1172C38.8942 40.9585 38.2129 41.6406 37.3725 41.6406H26.5174C25.6769 41.6406 24.9957 40.9585 24.9957 40.1172C24.9957 39.2758 25.6769 38.5938 26.5174 38.5938ZM13.5516 18.3414C14.1459 17.7464 15.1094 17.7464 15.7037 18.3414L16.5311 19.1698L20.0405 15.6566C20.6349 15.0617 21.5983 15.0615 22.1925 15.6566C22.7868 16.2514 22.7868 17.2161 22.1925 17.811L17.6071 22.4014C17.4658 22.5429 17.2981 22.6551 17.1135 22.7317C16.9288 22.8082 16.7309 22.8476 16.531 22.8476C16.3311 22.8476 16.1332 22.8082 15.9486 22.7317C15.7639 22.6551 15.5962 22.5429 15.455 22.4014L13.5515 20.4957C12.9572 19.9009 12.9572 18.9362 13.5516 18.3414ZM13.5516 29.2733C14.1459 28.6783 15.1094 28.6783 15.7037 29.2733L16.5311 30.1016L20.0405 26.5884C20.6348 25.9935 21.5983 25.9935 22.1925 26.5884C22.7868 27.1832 22.7868 28.1478 22.1925 28.7428L17.6071 33.3333C17.4658 33.4747 17.2981 33.5869 17.1135 33.6635C16.9288 33.74 16.7309 33.7794 16.531 33.7794C16.3311 33.7794 16.1332 33.74 15.9486 33.6635C15.764 33.5869 15.5962 33.4747 15.455 33.3333L13.5515 31.4276C12.9572 30.8328 12.9572 29.8682 13.5516 29.2733ZM13.5516 39.4295C14.1459 38.8346 15.1094 38.8346 15.7037 39.4295L16.5311 40.2579L20.0405 36.7446C20.6348 36.1497 21.5983 36.1497 22.1925 36.7446C22.7868 37.3395 22.7868 38.3041 22.1925 38.899L17.6071 43.4896C17.4658 43.631 17.2981 43.7432 17.1135 43.8197C16.9288 43.8963 16.7309 43.9357 16.531 43.9357C16.3311 43.9357 16.1332 43.8963 15.9486 43.8197C15.764 43.7432 15.5962 43.631 15.455 43.4896L13.5515 41.5839C12.9572 40.989 12.9572 40.0245 13.5516 39.4295Z"
            fill="#00334E"
          />
          <path
            d="M15.8809 5.07812C15.8809 5.63905 16.335 6.09375 16.8954 6.09375H35.1563C35.7166 6.09375 36.1708 5.63905 36.1708 5.07812V1.01562C36.1708 0.454695 35.7166 0 35.1563 0H16.8954C16.335 0 15.8809 0.454695 15.8809 1.01562V5.07812Z"
            fill="#00334E"
          />
        </svg>
      ),
    },
  ];

  const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png",
    "/image4.png",
    "/image5.png",
  ];

  const scrollRef = useRef(null);

  // // Auto scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    let scrollAmount = 0;

    const scroll = () => {
      if (!container) return;
      scrollAmount += 0.5;
      container.scrollLeft = scrollAmount;

      // reset for infinite effect
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
      }
    };

    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, []);

  /* first section */
  const heroBgRef = useRef(null);
  const heroMainImgRef = useRef(null);
  const heroLeftImgRef = useRef(null);
  const heroRightImgRef = useRef(null);

  /* second section */
  const sec2ContentRef = useRef(null);
  const sec2TriangleRef = useRef(null);

  /* third section */
  const sec3ParaRef = useRef(null);
  const sec3HeadRef = useRef(null);
  const sec3TxtRef = useRef(null);
  const sec3BtnRef = useRef(null);
  const sec3RightRef = useRef(null);

  /* fourth section */
  const sec4HeadRef = useRef(null);
  const sec4BoxesRef = useRef([]);

  /* fifth section */
  const textWrapRef = useRef(null);
  const circleRef = useRef(null);
  const s5BtnRef = useRef(null);

  /* ── SECTION 1 animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // BG - top thi neeche reveal
      gsap.fromTo(
        heroBgRef.current,
        { clipPath: "ellipse(120% 0% at 50% 0%)" },
        { clipPath: "ellipse(200% 200% at 50% 0%)", duration: 3, ease: "power3.out" }
      );

      // Main img - top thi neeche
      gsap.from(heroMainImgRef.current, {
        y: -80, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out",
      });

      // Left img - left thi
      gsap.from(heroLeftImgRef.current, {
        x: -80, opacity: 0, duration: 1, delay: 0.8, ease: "power3.out",
      });

      // Right img - right thi
      gsap.from(heroRightImgRef.current, {
        x: 80, opacity: 0, duration: 1, delay: 0.8, ease: "power3.out",
      });

      // Float - up down
      [heroLeftImgRef.current, heroRightImgRef.current].forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { y: -12, duration: 2 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── SECTION 2 animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sec2ContentRef.current, start: "top 80%" };

      // Triangle - top thi neeche
      gsap.from(sec2TriangleRef.current, {
        y: -100, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: trigger,
      });

      // Text children - bottom thi upar
      gsap.from(sec2ContentRef.current?.children || [], {
        y: 60, opacity: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
        scrollTrigger: trigger,
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── SECTION 3 animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sec3ParaRef.current, start: "top 80%" };

      gsap.from(sec3ParaRef.current, { x: -60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: trigger });
      gsap.from(sec3HeadRef.current, { y: -50, opacity: 0, duration: 0.9, delay: 0.1, ease: "power3.out", scrollTrigger: trigger });
      gsap.from(sec3TxtRef.current, { x: 60, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out", scrollTrigger: trigger });

      gsap.set(sec3BtnRef.current, { opacity: 0, y: 20 });
      gsap.to(sec3BtnRef.current, {
        opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: "back.out(1.7)",
        scrollTrigger: trigger,
      });

      // Right img - right thi
      gsap.from(sec3RightRef.current, {
        x: 120, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sec3RightRef.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── SECTION 4 animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mission text - top thi neeche
      gsap.from(sec4HeadRef.current?.children || [], {
        y: -50, opacity: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sec4HeadRef.current, start: "top 80%" },
      });

      // Boxes - center thi zoom in pachhi settle
      sec4BoxesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.7,
            delay: i * 0.12,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: sec4HeadRef.current, start: "top 75%" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: textWrapRef.current, start: "top 80%" };

      // Circle - scale thi aave
      gsap.fromTo(
        circleRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: circleRef.current, start: "top 85%" },
        },
      );

      // "Woman-owned business" - p tag
      gsap.from(textWrapRef.current.children[0], {
        scrollTrigger: trigger,
        y: -40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      // Heading - h2
      gsap.from(textWrapRef.current.children[1], {
        scrollTrigger: trigger,
        y: -50,
        opacity: 0,
        duration: 0.8,
        delay: 0.12,
        ease: "power3.out",
      });

      // Paragraph
      gsap.from(textWrapRef.current.children[2], {
        scrollTrigger: trigger,
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: 0.24,
        ease: "power3.out",
      });

      // Button - alag set + to sathe
      gsap.set(s5BtnRef.current, { opacity: 0, y: 30, scale: 0.85 });
      gsap.to(s5BtnRef.current, {
        scrollTrigger: trigger,
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: 0.38,
        ease: "back.out(1.7)",
      });
    });
    return () => ctx.revert();
  }, []);

  /* last section */
  const wrapRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = wrapRef.current.children;
      gsap.from(items[0], {
        y: -80,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(items[1], {
        x: -120,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(items[2], {
        y: 80,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(leftImgRef.current, {
        x: -200,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      gsap.from(rightImgRef.current, {
        x: 200,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
      });
      [leftImgRef.current, rightImgRef.current].forEach((el, i) => {
        gsap.to(el, {
          y: -20,
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="relative bg-[#F0FBFF]">
        <div ref={heroBgRef} className="bg-[#57CEF7] pt-2 md:pt-[1px] pb-32 md:pb-60">
          <Header />

          <div className="max-w-[1500px] mx-auto px-4 text-center mt-10 md:mt-15">
            <h1 className="text-3xl md:text-[60px] font-bold text-primary font-archivo mb-4">
              WINDY CITY ICE CREAM
            </h1>

            <p className="text-sm md:text-[16px] text-primary font-archivo max-w-[765px] mx-auto">
              Windy City Ice Cream is a true family story — one that began as a
              way to keep my brother busy and has grown into a beloved
              woman-owned business serving the Chicago area.
            </p>
          </div>
        </div>

        {/* IMAGE HALF IN / HALF OUT */}
        <div className="max-w-[1500px] mx-auto px-4 flex justify-center -mt-24 md:-mt-45">
          <div className="relative">
            <Image
              ref={heroMainImgRef}
              src="/about-hero.png"
              alt="main"
              width={1000}
              height={500}
              className="rounded-3xl w-[1108px] max-w-full h-auto"
            />

            <Image
              ref={heroLeftImgRef}
              src="/about-cendy1.png"
              alt="left"
              width={120}
              height={120}
              className="absolute 
    -left-2 sm:-left-4 md:-left-12 
    bottom-0 translate-y-1/2 z-10 
    w-[60px] sm:w-[80px] md:w-[120px] h-auto"
            />

            <Image
              ref={heroRightImgRef}
              src="/about-cendy2.png"
              alt="right"
              width={120}
              height={120}
              className="absolute 
    -right-2 sm:-right-4 md:-right-12 
    bottom-0 translate-y-1/2 z-10 
    w-[60px] sm:w-[80px] md:w-[120px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* second section*/}
      <div className="w-full overflow-hidden">
        <section className="relative w-full flex items-center justify-center py-16 md:py-24 lg:py-28 bg-[#F0FBFF]">
          <div ref={sec2ContentRef} className="relative text-center lg:max-w-[1081px] px-4 z-10">
            <div className="absolute inset-0 flex justify-center items-center -z-10">
              <div ref={sec2TriangleRef} className="w-0 h-0 border-l-[160px] border-r-[160px] border-t-[260px] border-l-transparent border-r-transparent border-t-[#DAF5FF80] md:border-l-[700px] md:border-r-[700px] md:border-t-[900px] lg:mb-70"></div>
            </div>

            <p className="text-xs md:text-[24px] text-secound font-architect mb-2">
              Nostalgia in Every Bite, Bringing Frozen Treats to You
            </p>

            <h1 className="text-2xl md:text-4xl lg:text-[70px] font-bold text-primary font-archivo mb-4">
              Our Journey
            </h1>

            <p className="text-xs md:text-[16px] text-primary font-archivo mb-1">
              The journey started when my nephew launched the business to help
              his dad stay active and engaged. In 2010, I joined in to help grow
              and run the company, bringing my passion for great service and
              community spirit. Over the years, my brother retired and my nephew
              moved to Texas, and for the last five years, I have proudly owned
              and operated Windy City Ice Cream as a woman-owned business
            </p>
            <p className="text-xs md:text-[16px] text-primary font-archivo mb-6">
              Our commitment goes beyond just serving frozen treats. We strive
              to create joyful, nostalgic moments for families, neighborhoods,
              workplaces, and events across Cook, Will, and DuPage counties.
            </p>

            <p className="text-xs md:text-[16px] text-primary font-archivo mb-6">
              As a family-run business, we understand the importance of trust,
              reliability, and a personal touch — values that continue to guide
              us every day. When you book Windy City Ice Cream, you’re not just
              getting an ice cream truck; you’re becoming part of our extended
              family.
            </p>

            <p className="text-xs md:text-[16px] text-primary font-archivo mb-6">
              Thank you for supporting a local, family-owned business that’s
              been bringing smiles and sweet memories to the Chicago area for
              over a decade.
            </p>
          </div>
        </section>

        <style jsx>{`
          .animate-marquee {
            animation: marquee 18s linear infinite;
          }
          .animate-marquee2 {
            animation: marquee2 18s linear infinite;
          }
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          @keyframes marquee2 {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>

      <div className="overflow-hidden w-full">
        <div className="flex gap-2 animate-scroll w-max hover:[animation-play-state:paused]">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, i) => (
            <img
              key={i}
              src={`/image${item}.png`}
              alt={`Windy City Ice Cream event photo ${item}`}
              className="w-[267px] h-[300px] object-cover rounded-xl flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* second section End*/}

      {/* Third section*/}
      <section className="w-full py-12 md:py-16 lg:py-20 px-4">
        <div className="mx-auto max-w-[1500px] grid grid-cols-12 items-center">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-6 lg:ml-20">
            <p ref={sec3ParaRef} className="text-secound text-sm lg:text-[24px] mb-2 font-architect">
              We come to you
            </p>

            <h2 ref={sec3HeadRef} className="text-2xl md:text-[47px] font-bold text-primary font-archivo mb-4 leading-tight lg:max-w-[607px]">
              Bring Joy and Nostalgia to Your Event with Windy City Ice Cream!
            </h2>

            <p ref={sec3TxtRef} className="text-sm md:text-[16px] text-primary mb-6 max-w-md font-archivo">
              When a bright yellow Windy City Ice Cream truck rolls up to your
              event, the smiles and excitement are instant! Whether it’s a
              corporate gathering, birthday party, graduation celebration, day
              cares, schools, block party, family reunion, or workplace treat,
              we create unforgettable moments with every stop.
            </p>

            <button ref={sec3BtnRef} className="bg-[#0072B0] text-white px-4 py-2 rounded-l-full text-sm md:text-[16px] btn2">
              Reach out
            </button>
          </div>

          {/* RIGHT */}
          <div ref={sec3RightRef} className="col-span-12 lg:col-span-6 mt-8 lg:mt-0 relative">
            <div className=" w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl">
              {/* MAIN IMAGE */}
              <Image
                src="/about1.png"
                alt="about1"
                width={624}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            {/* TOP RIGHT IMAGE */}
            <Image
              src="/about-bom.png"
              alt="top-right"
              width={120}
              height={120}
              className="absolute top-2 left-2 md:top-4 md:left-4 lg:-top-12 lg:-left-15 w-[60px] md:w-[80px] lg:w-[120px] h-auto"
            />
          </div>
        </div>
      </section>

     <section className="w-full z-10 lg:mb-15 mb-10">
          <div className="bg-[#00334E] whitespace-nowrap overflow-hidden py-3 lg:-skew-y-3 z-10 lg:mb-0 mb-2">
            <div className="marquee flex gap-20 lg:text-[24px] text-[15px] font-archivo text-white">
              <div className="flex gap-20">
                <span>#EmployeeAppreciation</span>
                <span>#CorporateCatering</span>
                <span>#IceCreamSocial</span>
                <span>#CREAMYDELIGHTS</span>
                <span>#SweetCelebrations</span>
                <span>#OfficeTreats</span>
              </div>
              <div className="flex gap-20">
                <span>#EmployeeAppreciation</span>
                <span>#CorporateCatering</span>
                <span>#IceCreamSocial</span>
                <span>#CREAMYDELIGHTS</span>
                <span>#SweetCelebrations</span>
                <span>#OfficeTreats</span>
              </div>
              <div className="flex gap-20">
                <span>#EmployeeAppreciation</span>
                <span>#CorporateCatering</span>
                <span>#IceCreamSocial</span>
                <span>#CREAMYDELIGHTS</span>
                <span>#SweetCelebrations</span>
                <span>#OfficeTreats</span>
              </div>
            </div>
          </div>

          <div className="bg-[#00334E] whitespace-nowrap overflow-hidden py-3 lg:skew-y-3 lg:-mt-14 mt-1 z-10">
            <div className="marquee2 flex gap-14 lg:text-[24px] text-[15px] font-archivo text-white">
              <div className="flex gap-14">
                <span>#BirthdayIceCream</span>
                <span>#GraduationParty</span>
                <span>#Celebrations</span>
                <span>#Events</span>
                <span>#IceCreamFun</span>
                <span>#TruckParty</span>
              </div>
              <div className="flex gap-14">
                <span>#BirthdayIceCream</span>
                <span>#GraduationParty</span>
                <span>#Celebrations</span>
                <span>#Events</span>
                <span>#IceCreamFun</span>
                <span>#TruckParty</span>
              </div>
              <div className="flex gap-14">
                <span>#BirthdayIceCream</span>
                <span>#GraduationParty</span>
                <span>#Celebrations</span>
                <span>#Events</span>
                <span>#IceCreamFun</span>
                <span>#TruckParty</span>
              </div>
            </div>
          </div>
          <style jsx>{`
          .marquee {
            display: flex;
            width: max-content;
            animation: scroll 15s linear infinite;
          }
          .marquee2 {
            display: flex;
            width: max-content;
            animation: scroll2 15s linear infinite;
          }
          @keyframes scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes scroll2 {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
        `}</style>
        </section>

        
      {/* Third section end*/}

      {/* Four section*/}

      <section className="w-full py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-[1500px] mx-auto">
          {/* TOP TEXT */}
          <div ref={sec4HeadRef} className="text-center mb-10">
            <h2 className="text-2xl md:text-[47px] font-bold text-primary font-archivo mb-3">
              OUR MISSION IS SIMPLE
            </h2>
            <p className="text-sm md:text-[16px] text-primary font-archivo lg:max-w-[517px] mx-auto">
              Deliver joy through frozen treats while providing top-tier
              service—with absolutely no hassle for you.
            </p>
          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {DATA.map((item, i) => (
              <div
                key={i}
                ref={(el) => (sec4BoxesRef.current[i] = el)}
                className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#F0FBFF] rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#DAF5FF] cursor-pointer"
              >
                <div className="mb-4">{item.icon}</div>

                <h3 className="text-lg lg:text-[24px] font-semibold text-primary font-archivo mb-2">
                  {item.title}
                </h3>

                <p className="text-sm lg:text-[16px] text-primary font-archivo">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Four section end*/}

      {/* Five section*/}
      <section className="w-full bg-[#F0FBFF] py-16 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1500px] px-4">
          <div className="relative flex flex-col items-center text-center">
            <div
              ref={circleRef}
              className="absolute w-[850px] h-[850px] bg-[#DAF5FF] rounded-full top-[-60px] z-0 overflow-hidden lg:block md:block hidden"
            />
            <div
              ref={textWrapRef}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <p className="text-secound font-architect mb-2 lg:text-[24px] text-sm">
                Woman-owned business
              </p>
              <h2 className="text-3xl md:text-[50px] font-bold text-primary font-archivo leading-tight">
                ICE CREAM TRUCKS AND CARTS SERVING CORPORATE EVENTS OF ALL SIZES
              </h2>
              <p className="mt-4 text-primary text-[16px] lg:max-w-[756px] font-archivo">
                Windy City Ice Cream is proudly based...
              </p>
              <button
                className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer mt-3"
                ref={s5BtnRef}
              >
                <span className="relative z-10">Reach out</span>
                <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 cursor-pointer"></span>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="mt-16 overflow-hidden whitespace-nowrap relative z-20"
          >
            <div className="flex gap-4 w-max">
              {[...images, ...images].map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt=""
                  width={250}
                  height={300}
                  className="w-62.5 h-75 object-cover rounded-xl shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Five section end*/}

      {/* last section */}
      <section className="w-full bg-white py-30 flex justify-center">
        <div className="w-full max-w-375 px-4 relative flex items-center justify-center">
          <Image
            ref={leftImgRef}
            src="/cendy4.png"
            alt=""
            width={200}
            height={200}
            className="hidden md:block absolute left-0 bottom-0 w-30 md:w-40 lg:w-50 h-auto"
          />
          <Image
            ref={rightImgRef}
            src="/icecon.png"
            alt=""
            width={220}
            height={220}
            className="hidden md:block absolute right-0 bottom-0 w-30 md:w-45 lg:w-55 h-auto"
          />

          <div ref={wrapRef} className="text-center lg:max-w-[842px] z-10">
            <h2 className="text-2xl md:text-4xl lg:text-[50px] font-bold text-primary font-archivo leading-tight">
              READY TO BRING AN ICE CREAM TRUCK TO YOUR EVENT?
            </h2>
            <p className="mt-4 text-primary text-sm md:text-[22px]">
              With hundreds of satisfied customers all over Chicago...
            </p>
            <button className="bg-[#0072B0] text-white px-4 py-2 rounded-r-full text-sm md:text-[16px] btn relative overflow-hidden group transform transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer mt-3">
              <span className="relative z-10">Reach out</span>
              <span className="absolute inset-0 bg-[#004d73] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 cursor-pointer"></span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
