import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="flex flex-col items-center gap-2">
                    <SearchX className="text-destructive mb-2" size={40} />
                    <CardTitle className="text-center">Page Not Found</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p className="text-center text-muted-foreground">
                        Sorry, we couldn&apos;t find the page or resource you were looking for.<br />
                        It may have been moved, deleted, or you may have mistyped the address.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/">Return Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}