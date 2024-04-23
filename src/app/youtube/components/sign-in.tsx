import { Button } from "~/components/ui/button";

export function SignIn() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <form>
        <Button
          variant="secondary"
          className="rounded-full bg-[#FF0000] pl-14 relative"
          type="submit"
        >
          <img
            src="/youtube.png"
            className="absolute w-16 h-16 top-[-12px] left-[0px]"
          />
          Connect your Youtube account
        </Button>
      </form>
    </div>
  );
}
