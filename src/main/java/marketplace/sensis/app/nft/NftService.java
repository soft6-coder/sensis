package marketplace.sensis.app.nft;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NftService {
	@Autowired
	private NftRepository nftRepository;
	
	public Nft addNft(Nft nft) {
		return nftRepository.save(nft);
	}
	
	public Nft getNftByToken(String token) {
		return nftRepository.findByToken(token);
	}
	
	public List<Nft> getNfts() {
		return (List<Nft>) nftRepository.findAll();
	}
	
}
