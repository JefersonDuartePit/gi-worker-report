import svgPaths from "./svg-fg9u7nyk7h";

function Container() {
  return (
    <div className="h-[105px] relative shrink-0 w-[256px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 105">
        <g id="Container">
          <mask fill="white" id="path-1-inside-1_2_37">
            <path d="M0 0H256V105H0V0Z" />
          </mask>
          <path d={svgPaths.p108c4c00} fill="var(--stroke-0, #1D293D)" mask="url(#path-1-inside-1_2_37)" />
          <g id="Vector">
            <path d={svgPaths.paeb3500} fill="var(--fill-0, white)" />
            <path clipRule="evenodd" d={svgPaths.p265da600} fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d={svgPaths.p19299900} fill="var(--fill-0, white)" />
            <path d={svgPaths.p37de44b0} fill="var(--fill-0, white)" />
            <path d={svgPaths.p1a129880} fill="var(--fill-0, white)" />
            <path d={svgPaths.p1ac38900} fill="var(--fill-0, white)" />
            <path clipRule="evenodd" d={svgPaths.p20894500} fill="var(--fill-0, white)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p2d87c00} fill="var(--fill-0, white)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2_32)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p17212180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 10H18.3333" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2_32">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[110.539px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Portal Candidato</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#1d293d] content-stretch flex gap-[12px] h-[44px] items-center left-0 pl-[16px] rounded-[8px] top-0 w-[224px]" data-name="Button">
      <Icon />
      <Text />
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="List Item">
      <Button />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col h-[380px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[256px]" data-name="Navigation">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] px-[16px] relative size-full">
          <List />
        </div>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#e2e8f0] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">RH</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#314158] relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[14px] text-white top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Ana Carolina</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#90a1b9] text-[12px] top-px whitespace-nowrap">Candidata</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[36px] relative shrink-0 w-[62.82px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[40px] items-center relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[73px] relative shrink-0 w-[256px]" data-name="Container">
      <div aria-hidden className="absolute border-[#1d293d] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[17px] px-[16px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <div className="bg-[#0f172b] content-stretch flex flex-col items-start relative size-full" data-name="Sidebar">
      <Container />
      <Navigation />
      <Container1 />
    </div>
  );
}